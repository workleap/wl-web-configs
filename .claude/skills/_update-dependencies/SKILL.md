---
name: update-dependencies
description: Update the repo's outdated npm dependencies — every workspace package to latest, peer ranges fixed, tree left dirty for review. Can reset + reinstall and run lint + tests afterward, opt-in up front. Scoped to npm packages only — agent skills are updated by `_update-skills` (or both together via `_update-third-parties`). Use as "/update-dependencies" or when asked to update, bump, or refresh the project's npm dependencies.
model: sonnet
effort: medium
---

# Update dependencies

Bring the repo's npm dependencies up to date. Do the steps in order; stop and surface any failure.

`eslint`, `@eslint/js`, `stylelint`, `stylelint-config-standard`, `typescript` and `webpack-dev-server` are held back on purpose — the scripts below exclude them; see "Held-back dependencies" in `CONTRIBUTING.md`. Never bump them manually.

## 1. Ask what to run afterward

Ask this **first**, before touching anything, so the rest of the run is unattended — the user answers, then walks away. Present both follow-ups in a **single multi-select prompt**; both checkable, neither pre-selected:

| Action          | Runs (in step 4)                 | Purpose                                                              |
| --------------- | -------------------------------- | -------------------------------------------------------------------- |
| Reset + install | `pnpm reset` then `pnpm install` | Wipes `node_modules` + `pnpm-lock.yaml`, rebuilds from `package.json` |
| Lint + test     | `pnpm lint` then `pnpm test`     | Builds the packages, lints, typechecks and runs the test suites       |

Remember the selection; it runs in step 4 after the update, not now. Neither checked -> nothing runs after the update.

## 2. List what's outdated

```
pnpm list-outdated-deps
```

It exits 1 whenever anything is outdated — expected, not a failure. Report the outdated packages and any peer-version mismatches before changing anything.

## 3. Update the dependencies

```
pnpm update-outdated-deps
```

## 4. Run the selected follow-ups

Run only what the user checked in step 1, and only if the update actually changed something:

- **Nothing was outdated, or `update-outdated-deps` failed** -> skip the follow-ups; say so.
- **Neither checked** -> done.
- **Both checked** -> reset + install first, then lint + test (they validate the fresh install).
- **One checked** -> run just that one.

## Report

Summarize: packages bumped (old -> new), peer fixes applied, and which final actions ran (reset + install, lint + test, or none) with their result. Flag any major-version jumps — those are the likely breakage points — and any `peerDependencies` range narrowed by `syncpack fix`, since those reach consumers. Recommend `pnpm lint` + `pnpm test` before committing if they didn't run, and a changeset for every `@workleap/*` package whose `dependencies` or `peerDependencies` changed.
