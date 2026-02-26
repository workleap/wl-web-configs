# Sync Workleap Web Configs Skill

You are an automated agent responsible for keeping the `workleap-web-configs` agent skill in sync with the documentation in `./docs`.

## Constraints

When updating the skill:

- Do NOT change the format of existing skill files.
- You MAY create new `references/*.md` files when new content does not fit any existing reference file.
- Do NOT embed metadata in skill files.
- Do NOT add "Sources:" lines to skill files.
- Do NOT create or modify any files outside `agent-skills/workleap-web-configs/`.
- Do NOT use TodoWrite, TaskCreate, or any task tracking tools.
- Never update a versioned skill. You can identify a versioned skill with its folder name pattern, e.g. `workleap-web-configs-v*`.
- Never change skill content unless you can point to a specific line in `./docs` that contradicts the current skill text. If you cannot identify the exact discrepancy, do not touch the content.
- The SKILL.md body must stay under ~250 lines. New content goes in the appropriate `references/` file, not in the body. Only add to the body if the content is a critical cross-cutting pattern that agents need in nearly every conversation.

## Excluded docs

The following docs are **not** part of the skill and must be ignored:

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
- `docs/introduction/use-with-agents.md` — Meta-docs about using the agent skill itself
- `docs/introduction/index.yml`, `docs/*/default.yml` — YAML navigation/config files

All other `.md` files under `docs/` are in scope.

## Docs-to-skill file routing

Use this table to decide which skill file to update for a given docs path:

| Skill file | Primary docs sources |
|---|---|
| `SKILL.md` | `docs/introduction/*`, `docs/browserslist/*` |
| `references/eslint.md` | `docs/eslint/*` |
| `references/rsbuild.md` | `docs/rsbuild/*` |
| `references/rslib.md` | `docs/rslib/*` |
| `references/stylelint.md` | `docs/stylelint/*` |
| `references/typescript.md` | `docs/typescript/*` |

If a doc does not match any row above, use your best judgment to route it to the most relevant skill file. Always respect the "Excluded docs" section — never sync content from excluded paths.

---

## Step 1: Update skill

Review the existing `workleap-web-configs` skill in `./agent-skills/workleap-web-configs/` and make sure that all configuration definitions and examples match the current documentation available in `./docs`. Use the routing table above to target your comparisons. Skip any paths listed in the "Excluded docs" section.

## Step 2: Check for changes

After updating the skill, check whether any files were actually modified:

```bash
git diff --name-only HEAD -- agent-skills/workleap-web-configs/
git ls-files --others --exclude-standard -- agent-skills/workleap-web-configs/
```

If both commands produce empty output (no changes at all), STOP immediately. Print "No skill changes needed — skill is already in sync." You are done.

## Step 3: Validate

Spawn a subagent with the `Task` tool using the **opus** model to validate the updated skill with a fresh context. The subagent validates from two angles: (1) can the skill answer key questions, and (2) are the configuration signatures and examples factually correct compared to the actual docs.

Use the following prompt for the subagent:

> You are a validator for the `workleap-web-configs` agent skill. Your job is to verify both **coverage** and **accuracy**.
>
> ## Part A — Coverage
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
> Now read all `.md` files under `./docs/`, excluding the paths listed in the "Excluded docs" section of `./.github/prompts/sync-agent-skill.md`. For each code example and configuration signature in the skill files, verify it matches the docs. Report any discrepancies: wrong function names, missing parameters, incorrect config file names, outdated patterns.
>
> ## Output
>
> End with:
> - `COVERAGE: X/18 PASSED`
> - `ACCURACY: list of discrepancies (or "No discrepancies found")`

If any coverage question is marked FAIL or accuracy discrepancies are found, go back to Step 1 and fix the gaps. Retry at most 3 times. If validation passes, proceed to Step 4. If validation still fails after 3 retries, proceed to Step 4 anyway but include the unresolved issues in the PR (see Step 4c).

## Step 4: Success

### 4a: Increment version

Read the `metadata.version` field in the YAML frontmatter of `agent-skills/workleap-web-configs/SKILL.md`. Increment the **minor** part of the version (e.g., `1.0` → `1.1`, `5.3` → `5.4`). Update the file with the new version.

### 4b: Create branch and commit

```bash
BRANCH_NAME="agent/skill-sync-$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
git checkout -b "$BRANCH_NAME"
git add agent-skills/workleap-web-configs/
git commit -m "chore(skill): sync workleap-web-configs skill with docs [skip ci]"
git push origin "$BRANCH_NAME"
```

### 4c: Create pull request

If validation passed cleanly:

```bash
gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore(skill): sync workleap-web-configs skill" \
  --body "## Summary

<Write a short summary of what was updated in the skill>"
```

If validation still had failures after 3 retries, create the PR anyway but include a warnings section:

```bash
gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore(skill): sync workleap-web-configs skill" \
  --body "## Summary

<Write a short summary of what was updated in the skill>

## ⚠️ Validation Warnings

The following issues could not be resolved after 3 retries:

<List the failed coverage questions and/or accuracy discrepancies>"
```

Then STOP. You are done.
