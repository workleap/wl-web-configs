---
name: update-skills
description: Refresh the agent skills installed in `.agents/skills/`, but only when the matching monorepo package is on the latest minor (patch ignored). Skills with no package gate are always updated.
model: sonnet
effort: medium
metadata:
  internal: true
---

# Update Skills

Re-pull every `skills add` installed skill in this repo, but only when the matching package in `package.json` is on the latest `major.minor`. Print the eligibility table before running anything; on lag, skip + warn (never auto-bump deps).

Installed skills live in `.agents/skills/` (for Codex, GitHub Copilot and OpenCode), tracked in `skills-lock.json`. Out of scope: `.claude/skills/` (project-local skills) and `agent-skills/` (this repo's own published skills).

## Skills

Use `pnpm dlx`, not `pnpx` — `pnpx` fails under this repo's pnpm version. Use `skills add`, not `skills update` — these skills predate the CLI's `skillPath` tracking, so `update` refuses them. The first re-add of each skill adds a `skillPath` field to its `skills-lock.json` entry; that's expected.

| Skill | Package gate (grep all `package.json`) | Update command |
|---|---|---|
| `agent-browser` | `agent-browser` | `pnpm dlx skills add vercel-labs/agent-browser --skill agent-browser -a codex github-copilot opencode -y` |
| `git-commit` | — | `pnpm dlx skills add github/awesome-copilot --skill git-commit -a codex github-copilot opencode -y` |
| `pnpm` | `pnpm` (root `packageManager` field) | `pnpm dlx skills add antfu/skills --skill pnpm -a codex github-copilot opencode -y` |
| `rsbuild-best-practices` | `@rsbuild/core` | `pnpm dlx skills add rstackjs/agent-skills --skill rsbuild-best-practices -a codex github-copilot opencode -y` |
| `turborepo` | `turbo` | `pnpm dlx skills add vercel/turborepo --skill turborepo -a codex github-copilot opencode -y` |
| `vitest` | `vitest` | `pnpm dlx skills add antfu/skills --skill vitest -a codex github-copilot opencode -y` |

## Process

### 0. Audit drift

List the folders in `.agents/skills/` and the keys of `skills` in `skills-lock.json`. Compare both to the `Skill` column in the table above.

- Folder or lock entry present, no table row → **stop**. Print `unknown skill "<name>" — add a row to SKILL.md (source is in skills-lock.json) and re-run.`
- Table row present, no folder or lock entry → **stop**. Print `stale row "<name>" — not installed. Remove the row or reinstall the skill, then re-run.`

Only proceed once the three sets match exactly.

### 1. Read installed versions

For each gated skill, grep every `package.json` under the repo (root, `packages/*`, `samples/**`, excluding `node_modules`) for the listed package name and collect every pinned version in `dependencies` and `devDependencies`. Ignore `peerDependencies` — they're intentionally wide ranges. For `pnpm`, read the version from the root `packageManager` field.

### 2. Fetch latest versions

For each unique package: `pnpm view <package> version`. Parallelize.

### 3. Compute eligibility

For each gated package: extract `major.minor` from installed vs latest (ignore patch and prereleases) → `current` or `lagging`. A skill is eligible only if its package is `current` **and** every pinned occurrence across the repo matches. Untied skills (`—` gate) are always eligible.

### 4. Print eligibility table

Print before running anything. Use `UPDATE` or `SKIP` (gated package lagging).

```
skill                          | status  | details
turborepo                      | UPDATE  | turbo 2.11.9 vs latest 2.11.12 (minor matches)
rsbuild-best-practices         | SKIP    | @rsbuild/core in samples/rsbuild/app lagging: 2.1.0 vs latest 2.2.14
git-commit                     | UPDATE  | no package gate
...
```

### 5. Run updates

Run the matching command from the table for each `UPDATE` row, sequentially — the skill installer mutates a shared store and `skills-lock.json`.

### 6. Report

- Skills updated (count + list), noting which ones actually changed on disk (`git status --short .agents/skills`)
- Skills skipped (with the lagging package: installed vs latest)
- Any `skills add` failures (full error)
