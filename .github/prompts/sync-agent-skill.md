# Sync Workleap Web Configs Skills

You are an automated agent responsible for keeping the Web Configs agent skills in sync with the documentation in `./docs`. There are two kinds of skills to keep in sync:

- **Umbrella skill**: `agent-skills/workleap-web-configs/` — distributed through [skills.sh](https://skills.sh/), covers every active package.
- **Package skills**: `packages/<package>/skills/workleap-<package>/` — bundled in the matching npm package and linked by pnpm into consumers' agent skills folders. Each covers a single package.

Package skills are seeded from the umbrella skill's reference files and must stay consistent with them: the same configuration signatures, options and examples.

## Constraints

When updating the skills:

- Do NOT change the format of existing skill files.
- You MAY create new `references/*.md` files when new content does not fit any existing reference file.
- Do NOT embed metadata in skill files. The only exception is the existing `metadata.version` field of the umbrella skill (see Step 4a). Package skills have no `metadata` field — the package version is their version.
- Do NOT add "Sources:" lines to skill files.
- Do NOT create or modify any files outside `agent-skills/workleap-web-configs/`, `packages/*/skills/`, and the new changeset files you create in `.changeset/` (see Step 4b).
- Do NOT modify or delete existing files in `.changeset/`.
- Do NOT change the `name` field of any skill or rename any skill folder.
- Do NOT use TodoWrite, TaskCreate, or any task tracking tools.
- Never update a versioned skill. You can identify a versioned skill with its folder name pattern, e.g. `workleap-web-configs-v*`.
- Never change skill content unless you can point to a specific line in `./docs` that contradicts the current skill text. If you cannot identify the exact discrepancy, do not touch the content.
- The umbrella SKILL.md body must stay under ~250 lines. New content goes in the appropriate `references/` file, not in the body. Only add to the body if the content is a critical cross-cutting pattern that agents need in nearly every conversation.
- Package SKILL.md files must stay under ~500 lines. Migration guides belong in the package skill's `references/` folder.

## Excluded docs

The following docs are **not** part of any skill and must be ignored:

- `docs/postcss/` — PostCSS (maintenance mode, skill says "do not recommend")
- `docs/swc/` — SWC (maintenance mode, skill says "do not recommend")
- `docs/tsup/` — tsup (maintenance mode, skill says "do not recommend")
- `docs/webpack/` — webpack (maintenance mode, skill says "do not recommend")
- `docs/chromatic/` — Chromatic best practices (belongs to a different skill: workleap-chromatic-best-practices)
- `docs/syncpack/` — Syncpack (not part of the web-configs skill)
- `docs/vitest/` — Vitest (not part of the web-configs skill)
- `docs/static/` — Static image assets for the documentation site
- `docs/_includes/` — Documentation site configuration templates
- `docs/default.md` — Documentation site redirect page
- `docs/about.md` — Repository metadata and contribution info
- `docs/samples.md` — Links to external sample applications
- `docs/introduction/use-with-agents.md` — Meta-docs about using the agent skills themselves
- `docs/introduction/index.yml`, `docs/*/default.yml` — YAML navigation/config files

All other `.md` files under `docs/` are in scope.

## Docs-to-skill file routing

Use this table to decide which skill files to update for a given docs path. When a row lists a package skill, update **both** the umbrella file and the package skill file.

| Primary docs sources | Umbrella skill file | Package skill file |
|---|---|---|
| `docs/introduction/*` (excluding CI workflows) | `SKILL.md` | — |
| `docs/introduction/setup-a-ci-workflow.md`, `docs/introduction/setup-turborepo-ci-workflow.md` | `references/ci.md` | `packages/eslint-configs/skills/workleap-eslint-configs/references/ci.md` |
| `docs/browserslist/*` | `SKILL.md` | `packages/browserslist-config/skills/workleap-browserslist-config/SKILL.md` |
| `docs/eslint/*` | `references/eslint.md` | `packages/eslint-configs/skills/workleap-eslint-configs/SKILL.md` (migration: `references/migrate-from-eslint-8.md`) |
| `docs/rsbuild/*` | `references/rsbuild.md` | `packages/rsbuild-configs/skills/workleap-rsbuild-configs/SKILL.md` (migration: `references/migrate-from-webpack.md`) |
| `docs/rslib/*` | `references/rslib.md` | `packages/rslib-configs/skills/workleap-rslib-configs/SKILL.md` (migration: `references/migrate-from-tsup.md`) |
| `docs/stylelint/*` | `references/stylelint.md` | `packages/stylelint-configs/skills/workleap-stylelint-configs/SKILL.md` |
| `docs/typescript/*` | `references/typescript.md` | `packages/typescript-configs/skills/workleap-typescript-configs/SKILL.md` (migration: `references/migrate-to-tsgo.md`) |

Umbrella skill files are relative to `agent-skills/workleap-web-configs/`.

If a doc does not match any row above, use your best judgment to route it to the most relevant skill files. Always respect the "Excluded docs" section — never sync content from excluded paths.

---

## Step 1: Update skills

Review the existing `workleap-web-configs` umbrella skill in `./agent-skills/workleap-web-configs/` and the package skills in `./packages/*/skills/`, and make sure that all configuration definitions and examples match the current documentation available in `./docs`. Use the routing table above to target your comparisons. Skip any paths listed in the "Excluded docs" section.

When you change an umbrella reference file, apply the equivalent change to the matching package skill file, and vice versa.

## Step 2: Check for changes

After updating the skills, check whether any files were actually modified:

```bash
git diff --name-only HEAD -- agent-skills/workleap-web-configs/ packages/*/skills/
git ls-files --others --exclude-standard -- agent-skills/workleap-web-configs/ packages/*/skills/
```

If both commands produce empty output (no changes at all), STOP immediately. Print "No skill changes needed — skills are already in sync." You are done.

## Step 3: Validate

First, run the package skills validation script and fix any reported error:

```bash
node ./scripts/validate-package-skills.ts
```

Then, spawn a subagent with the `Task` tool using the **opus** model to validate the updated skills with a fresh context. The subagent validates from three angles: (1) can the umbrella skill answer key questions, (2) are the configuration signatures and examples factually correct compared to the actual docs, and (3) can each package skill answer the questions about its package and does it stay consistent with the umbrella skill.

Use the following prompt for the subagent:

> You are a validator for the Web Configs agent skills: the `workleap-web-configs` umbrella skill in `./agent-skills/workleap-web-configs/` and the package skills in `./packages/*/skills/`. Your job is to verify **coverage**, **accuracy**, and **consistency**.
>
> ## Part A — Umbrella coverage
>
> Read all files in `./agent-skills/workleap-web-configs/`. Using ONLY those files, determine whether the skill can adequately answer each question below. For each, respond PASS or FAIL with a brief explanation.
>
> 1. What is wl-web-configs and what shared configuration packages does it provide?
> 2. What is the design philosophy behind the shared configs (ESM/ESNext, no lock-in, by project type)?
> 3. Which tools are actively supported and which are in maintenance mode?
> 4. How do I pick the right ESLint configuration for my project type (web app, React library, TS library, monorepo)?
> 5. How do I install and set up `@workleap/eslint-configs` for a React web application?
> 6. How do I customize or extend the shared ESLint configuration with additional rules or plugins?
> 7. What rule categories does `@workleap/eslint-configs` provide, and how do I switch the test framework from Vitest to Jest?
> 8. Which TypeScript config file should I extend for a web application versus a library versus a monorepo workspace root?
> 9. How do I override specific TypeScript compiler options while still using the shared config?
> 10. What are the TypeScript advanced composition configs (`core.json`, `react.json`), and how do I configure monorepo path mappings?
> 11. How do I set up `@workleap/rsbuild-configs` for development, production builds, and Storybook?
> 12. How do I set up `@workleap/rslib-configs` for building a library, and what is the difference between bundleless and bundle mode?
> 13. How do I install and configure `@workleap/stylelint-configs` and integrate it with Prettier?
> 14. How do I customize Stylelint rules (disable, change severity, add plugins), and what CSS preprocessor limitations exist?
> 15. How do I set up and customize `@workleap/browserslist-config`, and why should it only be used in applications?
> 16. How do I use configuration transformers (`RsbuildConfigTransformer` / `RslibConfigTransformer`) for advanced config customization?
> 17. What type declarations (`env.d.ts`) are needed for SVG imports and CSS Modules in Rsbuild and Rslib projects?
> 18. What are the differences in configuration between a monorepo (Turborepo) setup and a polyrepo setup?
>
> ## Part B — Accuracy
>
> Now read all `.md` files under `./docs/`, excluding the paths listed in the "Excluded docs" section of `./.github/prompts/sync-agent-skill.md`. For each code example and configuration signature in the umbrella skill files and the package skill files, verify it matches the docs. Report any discrepancies: wrong function names, missing parameters, incorrect config file names, outdated patterns.
>
> ## Part C — Package skills
>
> For each package skill, read ONLY the files of that skill and determine whether it can adequately answer the questions from Part A that concern its package. For each, respond PASS or FAIL with a brief explanation.
>
> - `packages/eslint-configs/skills/workleap-eslint-configs/`: questions 4, 5, 6, 7
> - `packages/typescript-configs/skills/workleap-typescript-configs/`: questions 8, 9, 10
> - `packages/rsbuild-configs/skills/workleap-rsbuild-configs/`: questions 11, 16 (Rsbuild part), 17 (Rsbuild part)
> - `packages/rslib-configs/skills/workleap-rslib-configs/`: questions 12, 16 (Rslib part), 17 (Rslib part)
> - `packages/stylelint-configs/skills/workleap-stylelint-configs/`: questions 13, 14
> - `packages/browserslist-config/skills/workleap-browserslist-config/`: question 15
>
> Then, compare each package skill with the matching umbrella file (see the routing table in `./.github/prompts/sync-agent-skill.md`) and report every code example, option table row, or signature that differs between the two.
>
> ## Output
>
> End with:
> - `COVERAGE: X/18 PASSED`
> - `PACKAGE COVERAGE: X/Y PASSED`
> - `ACCURACY: list of discrepancies (or "No discrepancies found")`
> - `CONSISTENCY: list of differences between package skills and the umbrella skill (or "No differences found")`

If any coverage question is marked FAIL, or accuracy discrepancies or consistency differences are found, go back to Step 1 and fix the gaps. Retry at most 3 times. If validation passes, proceed to Step 4. If validation still fails after 3 retries, proceed to Step 4 anyway but include the unresolved issues in the PR (see Step 4d).

## Step 4: Success

### 4a: Increment the umbrella skill version

Only if files under `agent-skills/workleap-web-configs/` changed: read the `metadata.version` field in the YAML frontmatter of `agent-skills/workleap-web-configs/SKILL.md`. Increment the **minor** part of the version (e.g., `1.0` → `1.1`, `5.3` → `5.4`). Update the file with the new version.

### 4b: Add a changeset for the package skills

Package skills only reach consumers when the package is published, which requires a changeset. If files under `packages/*/skills/` changed, create a **single** new changeset file named `.changeset/sync-package-skills-<timestamp>.md` (e.g. `sync-package-skills-20260101-120000.md`) with a `patch` bump for every package whose skill changed. Use the package name from the package's `package.json`:

```md
---
"@workleap/eslint-configs": patch
"@workleap/rsbuild-configs": patch
---

Sync the bundled agent skill with the documentation.
```

### 4c: Create branch and commit

Do NOT add `[skip ci]` to the commit message: the changesets workflow must run once the pull request is merged to release the updated package skills.

```bash
BRANCH_NAME="agent/skill-sync-$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
git checkout -b "$BRANCH_NAME"
git add agent-skills/workleap-web-configs/ packages/*/skills/ .changeset/
git commit -m "chore(skill): sync web configs skills with docs"
git push origin "$BRANCH_NAME"
```

### 4d: Create pull request

If validation passed cleanly:

```bash
gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore(skill): sync web configs skills" \
  --body "## Summary

<Write a short summary of what was updated in the umbrella skill and in each package skill>"
```

If validation still had failures after 3 retries, create the PR anyway but include a warnings section:

```bash
gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore(skill): sync web configs skills" \
  --body "## Summary

<Write a short summary of what was updated in the umbrella skill and in each package skill>

## ⚠️ Validation Warnings

The following issues could not be resolved after 3 retries:

<List the failed coverage questions, accuracy discrepancies and/or consistency differences>"
```

Then STOP. You are done.
