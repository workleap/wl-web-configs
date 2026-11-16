// The rules that keep the npm publishing identity of changeset.yml away from caches, install scripts and build tooling.
// They are enforced on the workflows of this repository by workflow-rules.test.ts.
import { parse } from "yaml";

interface Step {
    name?: string;
    uses?: string;
    run?: string;
    with?: Record<string, unknown>;
}

// A string is a permission preset ("read-all", "write-all") and an empty key is null: neither lists what a job needs.
type Permissions = Record<string, string> | string | null;

interface Job {
    permissions?: Permissions;
    steps?: Step[];
}

interface Workflow {
    env?: Record<string, unknown>;
    permissions?: Permissions;
    jobs?: Record<string, Job>;
}

const Install = /\bpnpm\s+(install|i)\b/;
const UnlockedInstall = /\b(pnpm\s+(add|dlx|update|up)|npm\s+(install|i|ci|exec)|npx|yarn)\b/;
const BuildTooling = /\b(turbo|build)\b/;
const RequiredInstallFlags = ["--frozen-lockfile", "--ignore-scripts", "--filter"];

// Everything a job holding a write permission, the npm publishing identity included, may run: it installs the
// Changesets CLI, takes the packages built by the other job and publishes them. Adding a build, a test or a script
// of a dependency to these lists gives that code the publishing identity.
const PublisherActions = new Set(["actions/checkout", "pnpm/action-setup", "actions/setup-node", "actions/download-artifact", "changesets/action"]);
const PublisherCommands = new Set([
    "node .github/scripts/check-lockfile-registry.ts",
    "pnpm install --frozen-lockfile --ignore-scripts --filter workspace-root",
    "git status --porcelain -- packages | (! grep .)"
]);
// The root script that only runs `changeset publish`.
export const PublishScript = "pnpm publish-pkg";

function label(step: Step) {
    return step.name ?? step.uses ?? step.run ?? "unnamed step";
}

function usesCache(step: Step) {
    const cacheInput = step.with?.cache;

    return step.uses?.startsWith("actions/cache") === true || (cacheInput !== undefined && cacheInput !== false && cacheInput !== "");
}

function isPermissionList(permissions: Permissions | undefined): permissions is Record<string, string> {
    return typeof permissions === "object" && permissions !== null;
}

function commands(step: Step) {
    return (step.run ?? "")
        .split("\n")
        .map(x => x.trim())
        .filter(x => x !== "");
}

function checkPublisherStep(step: Step) {
    const violations: string[] = [];
    const action = step.uses?.split("@")[0];

    if (action !== undefined && !PublisherActions.has(action)) {
        violations.push(`uses ${action}, which is not an action a job with a write permission may use`);
    }

    for (const command of commands(step)) {
        if (!PublisherCommands.has(command)) {
            violations.push(`runs \`${command}\`, which is not a command a job with a write permission may run`);
        }
    }

    if (action === "changesets/action") {
        for (const [input, value] of Object.entries(step.with ?? {})) {
            const isScript = /^(publish|version)(-script)?$/.test(input);

            if (isScript && (input !== "publish-script" || value !== PublishScript)) {
                violations.push(`sets \`${input}: ${String(value)}\`, the only script it may run is \`publish-script: ${PublishScript}\``);
            }
        }
    }

    return violations;
}

// A workflow that hands the repository to an agent, which runs content that was not reviewed.
export function isAgentWorkflow(source: string) {
    const workflow = parse(source) as Workflow;

    return Object.values(workflow.jobs ?? {}).some(job => job.steps?.some(step => step.uses?.startsWith("anthropics/claude-code-action@")));
}

// An agent job has no step that saves a cache: the jobs that run on main restore from the same scope.
// This does not stop an agent from reaching the cache service by itself, which is why changeset.yml restores no cache at all.
export function checkAgentWorkflow(source: string) {
    const workflow = parse(source) as Workflow;
    const violations: string[] = [];

    for (const [jobName, job] of Object.entries(workflow.jobs ?? {})) {
        for (const step of job.steps ?? []) {
            // actions/cache/restore only reads.
            if (usesCache(step) && step.uses?.startsWith("actions/cache/restore@") !== true) {
                violations.push(`${jobName}: "${label(step)}" saves a GitHub Actions cache.`);
            }
        }
    }

    return violations;
}

// The workflow that publishes to npm:
// - restores no cache, a pnpm store or a Turborepo cache another workflow could have written.
// - only installs from the lockfile, without lifecycle scripts, and never the whole workspace.
// - holds the npm publishing identity (id-token: write) in a single job, and a job with a write permission only runs
//   what is listed above.
export function checkPublishWorkflow(source: string) {
    const workflow = parse(source) as Workflow;
    const violations: string[] = [];
    const publishers: string[] = [];

    if (!isPermissionList(workflow.permissions) || Object.keys(workflow.permissions).length > 0) {
        violations.push("The workflow must set `permissions: {}`, so a job only holds the permissions it declares.");
    }

    if (String(workflow.env?.PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN) !== "false") {
        violations.push('The workflow must set the PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN environment variable to "false".');
    }

    for (const [jobName, job] of Object.entries(workflow.jobs ?? {})) {
        // Without its own list, the job would inherit the permissions of the workflow or of the repository.
        const canWrite = !isPermissionList(job.permissions) || Object.values(job.permissions).includes("write");

        if (!isPermissionList(job.permissions)) {
            violations.push(`${jobName}: the job must list its permissions.`);
        } else if (job.permissions["id-token"] === "write") {
            publishers.push(jobName);
        }

        for (const step of job.steps ?? []) {
            const stepViolations = canWrite ? checkPublisherStep(step) : [];

            if (usesCache(step)) {
                stepViolations.push("uses a GitHub Actions cache");
            }

            for (const command of commands(step)) {
                const missingFlags = RequiredInstallFlags.filter(flag => !command.includes(flag));

                if (Install.test(command) && missingFlags.length > 0) {
                    stepViolations.push(`installs without ${missingFlags.join(", ")}`);
                }

                if (UnlockedInstall.test(command)) {
                    stepViolations.push("fetches packages that are not pinned by the lockfile");
                }

                if (BuildTooling.test(command) && !command.includes("--force")) {
                    stepViolations.push("builds without --force, which bypasses the Turborepo cache");
                }
            }

            violations.push(...stepViolations.map(x => `${jobName}: "${label(step)}" ${x}.`));
        }
    }

    if (publishers.length !== 1) {
        violations.push(`Exactly one job must hold \`id-token: write\`, found ${publishers.length}.`);
    }

    return violations;
}
