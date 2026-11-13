---
name: update-skills
description: Refresh the agent skills installed in `.claude/skills/`, but only when the matching monorepo package is on the latest minor (patch ignored). Skills with no package gate are always eligible.
model: sonnet
effort: medium
metadata:
  internal: true
---

# Update Skills

Re-pull each `skills add` installed skill in this repo whose upstream moved, but only when the matching package in `package.json` is on the latest `major.minor`, and only past the cooldown. Print the eligibility table before running anything; on lag, skip + warn (never auto-bump deps).

Installed skills live in `.claude/skills/`, tracked in `skills-lock.json`. Out of scope: the `_`-prefixed project-local skills in `.claude/skills/`, the skills pnpm links from packages (listed in the `# pnpm` block of `.claude/skills/.gitignore`, when it exists), and `agent-skills/` (this repo's own published skills).

## Cooldown

Nothing is installed until it has sat unchanged upstream for 7 days: a skill's folder, and the `skills` CLI release that installs it. Step 2's listing applies the cooldown and offers what cleared it as `cli` and, per skill, `latest` — the only version and the only commit a command takes.

## Skills

`<cli>` and `<latest>` are the listing's. A command names the skill's own folder at `<latest>`: the folder is what cooled, and `--skill` alone installs the first skill of that name anywhere in the repo.

Use `pnpm dlx`, not `pnpx` — `pnpx` fails under this repo's pnpm version. Use `skills add`, not `skills update` — only `add` is handed the commit and the folder the listing cleared. Use `-a claude-code --copy`: it writes real files into `.claude/skills/` only. Never add another agent to `-a` — the CLI would recreate `.agents/skills/`, and pnpm would then link package skills there too.

| Skill | Package gate (grep all `package.json`) | Update command |
|---|---|---|
| `agent-browser` | `agent-browser` | `pnpm dlx skills@<cli> add https://github.com/vercel-labs/agent-browser/tree/<latest>/skills/agent-browser --skill agent-browser -a claude-code --copy -y` |
| `git-commit` | — | `pnpm dlx skills@<cli> add https://github.com/github/awesome-copilot/tree/<latest>/skills/git-commit --skill git-commit -a claude-code --copy -y` |
| `pnpm` | `pnpm` (root `packageManager` field) | `pnpm dlx skills@<cli> add https://github.com/antfu/skills/tree/<latest>/skills/pnpm --skill pnpm -a claude-code --copy -y` |
| `rsbuild-best-practices` | `@rsbuild/core` | `pnpm dlx skills@<cli> add https://github.com/rstackjs/agent-skills/tree/<latest>/skills/rsbuild-best-practices --skill rsbuild-best-practices -a claude-code --copy -y` |
| `turborepo` | `turbo` | `pnpm dlx skills@<cli> add https://github.com/vercel/turborepo/tree/<latest>/skills/turborepo --skill turborepo -a claude-code --copy -y` |
| `vitest` | `vitest` | `pnpm dlx skills@<cli> add https://github.com/antfu/skills/tree/<latest>/skills/vitest --skill vitest -a claude-code --copy -y` |

## Process

### 0. Audit drift

If `.agents/` exists → **stop**. Print `.agents/ exists — skills install into .claude/skills/ only. Remove it (reinstall any skill that only lives there with its table command), then re-run.`

List the folders in `.claude/skills/`, minus the `_`-prefixed project-local skills and the names in the `# pnpm` block of `.claude/skills/.gitignore` (when it exists). Compare them and the keys of `skills` in `skills-lock.json` to the `Skill` column in the table above.

- Folder or lock entry present, no table row → **stop**. Print `unknown skill "<name>" — add a row to SKILL.md (source is in skills-lock.json) and re-run.`
- Table row present, no folder or lock entry → **stop**. Print `stale row "<name>" — not installed. Remove the row or reinstall the skill, then re-run.`

Only proceed once the three sets match exactly.

### 1. Read installed versions

For each gated skill, grep every `package.json` under the repo (root, `packages/*`, `samples/**`, excluding `node_modules`) for the listed package name and collect every pinned version in `dependencies` and `devDependencies`. Ignore `peerDependencies` — they're intentionally wide ranges. For `pnpm`, read the version from the root `packageManager` field.

### 2. Fetch latest versions

For each unique package: `pnpm view <package> version`. Parallelize.

List `cli` and each skill's `pinned`, `latest` and `settled`:

```
node .claude/skills/_update-skills/scripts/listSkillPins.ts
```

A non-zero exit → **stop** and print its message.

### 3. Compute eligibility

For each gated package: extract `major.minor` from installed vs latest (ignore patch and prereleases) → `current` or `lagging`. A skill is eligible only if its package is `current` **and** every pinned occurrence across the repo matches. Untied skills (`—` gate) are always eligible.

An eligible skill then takes the listing's verdict:

- `settled: false` → `WAIT`: still in cooldown, no `latest` yet.
- `latest` equals `pinned` → `UNCHANGED`: no pull.
- otherwise → `UPDATE`.

### 4. Print eligibility table

Print before running anything. Use `UPDATE`, `UNCHANGED`, `WAIT` or `SKIP` (gated package lagging).

```
skill                          | status     | details
turborepo                      | UPDATE     | turbo 2.11.9 vs latest 2.11.12 (minor matches); b19f6a5 -> 4c1d2e9
vitest                         | UNCHANGED  | vitest 5.1.2 vs latest 5.1.4 (minor matches); pinned 8886fe2 is latest
rsbuild-best-practices         | SKIP       | @rsbuild/core in samples/rsbuild/app lagging: 2.1.0 vs latest 2.2.14
git-commit                     | WAIT       | no package gate; in cooldown
...
```

### 5. Run updates

Run the matching command from the table for each `UPDATE` row, `<cli>` and the full 40-character `<latest>` filled in, sequentially — the skill installer mutates a shared store and `skills-lock.json`.

A pull is done when the skill's `skills-lock.json` entry carries `latest` as its `ref`, under the `skillPath` it had; any other outcome is a failed `skills add`.

### 6. Report

- Skills updated (count + list, each with `<source>` and its pin move `<old commit> -> <new commit>`), noting which ones actually changed on disk (`git status --short .claude/skills`)
- Skills unchanged
- Skills in cooldown
- Skills skipped (with the lagging package: installed vs latest)
- Any `skills add` failures (full error)
