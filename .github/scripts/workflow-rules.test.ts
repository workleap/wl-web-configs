// node --test .github/scripts/workflow-rules.test.ts
import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { findForeignResolutions } from "./check-lockfile-registry.ts";
import { checkAgentWorkflow, checkPublishWorkflow, isAgentWorkflow, PublishScript } from "./workflow-rules.ts";

const RootPath = join(import.meta.dirname, "../..");
const WorkflowsPath = join(RootPath, ".github/workflows");

// The scripts pnpm runs from the package.json of a package when it packs and publishes that package.
const PublishLifecycleScripts = new Set(["prepublish", "prepare", "prepublishOnly", "prepack", "postpack", "publish", "postpublish"]);

// The single job that published before it was split in a build job and a release job.
const SingleJobPublishWorkflow = `
on:
  push:
    branches: ["main"]
env:
  CI: true
jobs:
  version:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
    steps:
      - name: Install Node.js
        uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          cache: pnpm
      - name: Install Dependencies
        run: pnpm install --frozen-lockfile
      - name: Restore Turborepo cache
        uses: actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          key: turbo-changeset
          path: .turbo
      - name: Build packages
        run: pnpm build-pkg
      - name: Publish
        uses: changesets/action@ae32849d5ba541f9ae29e40e22a623bc13562f51 # v2.1.2
        with:
          publish-script: pnpm publish-pkg
`;

const BuildSteps = `      - run: pnpm install --frozen-lockfile --ignore-scripts --filter "{./packages/*}..."
      - run: pnpm build-pkg --force`;

const ReleaseSteps = `      - run: pnpm install --frozen-lockfile --ignore-scripts --filter workspace-root
      - uses: changesets/action@ae32849d5ba541f9ae29e40e22a623bc13562f51 # v2.1.2
        with:
          publish-script: pnpm publish-pkg`;

function publishWorkflow(buildSteps = BuildSteps, releaseSteps = ReleaseSteps) {
    return `
env:
  PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: "false"
permissions: {}
jobs:
  build:
    permissions:
      contents: read
    steps:
${buildSteps}
  release:
    permissions:
      id-token: write
      contents: write
    steps:
${releaseSteps}
`;
}

function readJson(path: string) {
    return JSON.parse(readFileSync(path, "utf8")) as { scripts?: Record<string, string> };
}

void describe("this repository", () => {
    void it("publishes to npm from changeset.yml without breaking a rule", () => {
        deepStrictEqual(checkPublishWorkflow(readFileSync(join(WorkflowsPath, "changeset.yml"), "utf8")), []);
    });

    void it("has no agent workflow with a step that saves a cache", () => {
        const agentWorkflows = readdirSync(WorkflowsPath).filter(x => isAgentWorkflow(readFileSync(join(WorkflowsPath, x), "utf8")));

        // Fails if the agent workflows stop being detected, which would turn this test into a no-op.
        ok(agentWorkflows.includes("claude.yml") && agentWorkflows.includes("update-dependencies.yml"), `Found: ${agentWorkflows.join(", ")}`);

        for (const name of agentWorkflows) {
            deepStrictEqual(checkAgentWorkflow(readFileSync(join(WorkflowsPath, name), "utf8")), [], name);
        }
    });

    void it("only runs `changeset publish` with the publishing identity", () => {
        strictEqual(readJson(join(RootPath, "package.json")).scripts?.[PublishScript.replace("pnpm ", "")], "changeset publish");

        // pnpm would run these scripts in the release job, when it publishes the package.
        for (const name of readdirSync(join(RootPath, "packages"))) {
            const scripts = Object.keys(readJson(join(RootPath, "packages", name, "package.json")).scripts ?? {});

            deepStrictEqual(
                scripts.filter(x => PublishLifecycleScripts.has(x)),
                [],
                name
            );
        }
    });
});

void describe("checkPublishWorkflow", () => {
    void it("rejects the single job that restored caches, ran install scripts and built with the publishing identity", () => {
        deepStrictEqual(checkPublishWorkflow(SingleJobPublishWorkflow), [
            "The workflow must set `permissions: {}`, so a job only holds the permissions it declares.",
            'The workflow must set the PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN environment variable to "false".',
            'version: "Install Node.js" uses a GitHub Actions cache.',
            'version: "Install Dependencies" runs `pnpm install --frozen-lockfile`, which is not a command a job with a write permission may run.',
            'version: "Install Dependencies" installs without --ignore-scripts, --filter.',
            'version: "Restore Turborepo cache" uses actions/cache/restore, which is not an action a job with a write permission may use.',
            'version: "Restore Turborepo cache" uses a GitHub Actions cache.',
            'version: "Build packages" runs `pnpm build-pkg`, which is not a command a job with a write permission may run.',
            'version: "Build packages" builds without --force, which bypasses the Turborepo cache.'
        ]);
    });

    void it("accepts a build job without a write permission and a release job that only installs the workspace root", () => {
        deepStrictEqual(checkPublishWorkflow(publishWorkflow()), []);
    });

    void it("rejects a build that can read the Turborepo cache", () => {
        deepStrictEqual(checkPublishWorkflow(publishWorkflow("      - run: pnpm build-pkg")), [
            'build: "pnpm build-pkg" builds without --force, which bypasses the Turborepo cache.'
        ]);
    });

    void it("rejects a package fetched outside the lockfile", () => {
        deepStrictEqual(checkPublishWorkflow(publishWorkflow("      - run: pnpm dlx skills@latest")), [
            'build: "pnpm dlx skills@latest" fetches packages that are not pinned by the lockfile.'
        ]);
    });

    void it("rejects an install run by the pnpm setup action", () => {
        const setup = (input: string) =>
            `      - name: Install pnpm\n        uses: pnpm/action-setup@73e46992e05b19abd31f2f3c20e0e7370d762115 # v6.1.1${input}`;
        const violations = ['release: "Install pnpm" must set `run_install: false`.'];

        deepStrictEqual(
            checkPublishWorkflow(publishWorkflow(BuildSteps, `${setup("\n        with:\n          run_install: false")}\n${ReleaseSteps}`)),
            []
        );
        deepStrictEqual(
            checkPublishWorkflow(publishWorkflow(BuildSteps, `${setup("\n        with:\n          run_install: true")}\n${ReleaseSteps}`)),
            violations
        );
        deepStrictEqual(
            checkPublishWorkflow(
                publishWorkflow(
                    BuildSteps,
                    `${setup("\n        with:\n          run_install: |\n            - args: [--frozen-lockfile]")}\n${ReleaseSteps}`
                )
            ),
            violations
        );
        // Without the input, the behavior depends on the default of the action.
        deepStrictEqual(checkPublishWorkflow(publishWorkflow(BuildSteps, `${setup("")}\n${ReleaseSteps}`)), violations);
    });

    void it("rejects a second job holding the publishing identity", () => {
        deepStrictEqual(checkPublishWorkflow(publishWorkflow("      - run: pnpm build-pkg --force").replace("contents: read", "id-token: write")), [
            'build: "pnpm build-pkg --force" runs `pnpm build-pkg --force`, which is not a command a job with a write permission may run.',
            "Exactly one job must hold `id-token: write`, found 2."
        ]);
    });

    void it("rejects a job that inherits its permissions", () => {
        const workflow = publishWorkflow("      - run: pnpm build-pkg --force").replace("    permissions:\n      contents: read\n", "");

        deepStrictEqual(checkPublishWorkflow(workflow), [
            "build: the job must list its permissions.",
            'build: "pnpm build-pkg --force" runs `pnpm build-pkg --force`, which is not a command a job with a write permission may run.'
        ]);
    });

    void it("rejects a release job that runs anything but the install and the publish script", () => {
        const releaseSteps = `      - run: pnpm test
      - uses: actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
      - name: Publish
        uses: changesets/action@ae32849d5ba541f9ae29e40e22a623bc13562f51 # v2.1.2
        with:
          publish-script: pnpm build-pkg --force && pnpm publish-pkg`;

        deepStrictEqual(checkPublishWorkflow(publishWorkflow(BuildSteps, releaseSteps)), [
            'release: "pnpm test" runs `pnpm test`, which is not a command a job with a write permission may run.',
            'release: "actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9" uses actions/cache/restore, which is not an action a job with a write permission may use.',
            'release: "actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9" uses a GitHub Actions cache.',
            'release: "Publish" sets `publish-script: pnpm build-pkg --force && pnpm publish-pkg`, the only script it may run is `publish-script: pnpm publish-pkg`.'
        ]);
    });

    void it("rejects a workflow that lets pnpm reinstall the workspace before a script", () => {
        deepStrictEqual(checkPublishWorkflow(publishWorkflow().replace('PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: "false"', "CI: true")), [
            'The workflow must set the PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN environment variable to "false".'
        ]);
    });
});

void describe("checkAgentWorkflow", () => {
    const agentWorkflow = (step: string) => `
jobs:
  claude:
    steps:
${step}
      - uses: anthropics/claude-code-action@4d75e5f390ee76b2e09c1980ecc99ff3a2e088c8 # v1.0.275
`;

    void it("rejects the pnpm store cache of setup-node, which is saved when the job ends", () => {
        const workflow = agentWorkflow("      - name: Install Node.js\n        uses: actions/setup-node@v7\n        with:\n          cache: pnpm");

        ok(isAgentWorkflow(workflow));
        deepStrictEqual(checkAgentWorkflow(workflow), ['claude: "Install Node.js" saves a GitHub Actions cache.']);
    });

    void it("rejects a cache save and accepts a cache restore", () => {
        deepStrictEqual(checkAgentWorkflow(agentWorkflow("      - uses: actions/cache/save@v6")), [
            'claude: "actions/cache/save@v6" saves a GitHub Actions cache.'
        ]);
        deepStrictEqual(checkAgentWorkflow(agentWorkflow("      - uses: actions/cache/restore@v6")), []);
    });
});

void describe("findForeignResolutions", () => {
    const lockfile = (...packages: string[]) =>
        ["lockfileVersion: '9.0'", "", "packages:", "", ...packages, "", "snapshots:", "", "  yaml@2.9.1: {}"].join("\n");

    void it("accepts the lockfile of this repository", () => {
        deepStrictEqual(findForeignResolutions(readFileSync(join(RootPath, "pnpm-lock.yaml"), "utf8")), []);
    });

    void it("accepts a package resolved from the registry", () => {
        deepStrictEqual(
            findForeignResolutions(lockfile("  yaml@2.9.1:", "    resolution: {integrity: sha512-abc+/0==}", "    engines: {node: '>= 14.6'}")),
            []
        );
    });

    void it("rejects a tarball URL, a git repository and a resolution without an integrity hash", () => {
        const packages = [
            "  a@1.0.0:",
            "    resolution: {integrity: sha512-abc, tarball: https://example.com/a.tgz}",
            "  b@1.0.0:",
            "    resolution: {commit: 0123abc, repo: https://github.com/example/b.git, type: git}",
            "  c@1.0.0:",
            "    resolution: {tarball: https://example.com/c.tgz}"
        ];

        deepStrictEqual(findForeignResolutions(lockfile(...packages)), [
            "6: resolution: {integrity: sha512-abc, tarball: https://example.com/a.tgz}",
            "8: resolution: {commit: 0123abc, repo: https://github.com/example/b.git, type: git}",
            "10: resolution: {tarball: https://example.com/c.tgz}"
        ]);
    });

    void it("rejects a resolution that is not written the way pnpm writes it", () => {
        deepStrictEqual(findForeignResolutions(lockfile("  a@1.0.0:", '    "resolution": {tarball: https://example.com/a.tgz}')), [
            '6: "resolution": {tarball: https://example.com/a.tgz}'
        ]);
        deepStrictEqual(findForeignResolutions(lockfile("  a@1.0.0: {resolution: {tarball: https://example.com/a.tgz}}")), [
            "5: a@1.0.0: {resolution: {tarball: https://example.com/a.tgz}}"
        ]);
        deepStrictEqual(findForeignResolutions(lockfile("  a@1.0.0:", "    engines: {node: '>= 14.6'}", "    resolution: {integrity: sha512-abc}")), [
            "6: engines: {node: '>= 14.6'}",
            "7: resolution: {integrity: sha512-abc}"
        ]);
        deepStrictEqual(
            findForeignResolutions(
                lockfile("  a@1.0.0:", "    resolution: {integrity: sha512-abc}", "    resolution: {tarball: https://example.com/a.tgz}")
            ),
            ["7: resolution: {tarball: https://example.com/a.tgz}"]
        );
    });

    void it("rejects a lockfile without a packages section", () => {
        deepStrictEqual(findForeignResolutions("lockfileVersion: '9.0'\n"), ["The lockfile has no `packages:` section."]);
    });
});
