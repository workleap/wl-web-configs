---
name: workleap-chromatic-best-practices
description: |
  Workleap's Chromatic best practices for snapshot cost control and CI optimization. Use when auditing, setting up, or fixing Chromatic configurations — including TurboSnap-disabling patterns, CI workflows, chromatic.config.json, and monorepo setups. Also activate when reviewing PRs that touch Storybook or Chromatic-related files.
metadata:
  version: 1.2
---

# Workleap Chromatic Best Practices

Guide for auditing and updating repositories to follow Workleap's Chromatic best practices.

## Audit Workflow

When asked to audit or update a repository for Chromatic best practices, follow these steps in order.

### Step 1: Locate Chromatic Configuration

Search for existing Chromatic setup:

```
chromatic.config.json
.storybook/preview.ts[x]
.github/workflows/*chromatic*.yml or *storybook*.yml
package.json (scripts section)
```

If no Chromatic configuration exists, ask the user if they want to set it up.

### Step 2: Audit and Fix Each Practice

Run through all 10 checks below. For detailed code examples, detection patterns, and fix actions for each check, consult `references/audit-checks.md`.

| # | Check | What to look for |
|---|-------|-----------------|
| 2.1 | `untraced` config (optional) | `chromatic.config.json` — ask user about cost vs. regression trade-off |
| 2.2 | Preview barrel imports | `.storybook/preview.ts[x]` — barrel/index imports that disable TurboSnap |
| 2.3 | Local Chromatic scripts | `package.json` scripts — remove local chromatic commands |
| 2.4 | CI label-based triggering | GitHub Actions — require `run chromatic` label on PRs |
| 2.5 | CI required flags | `chromaui/action` — `onlyChanged`, `exitOnceUploaded`, `autoAcceptChanges` |
| 2.6 | CI git checkout depth | `actions/checkout` — `fetch-depth: 0` + Chromatic env vars |
| 2.7 | Browser configuration | CLI flags — Chrome only, remove multi-browser flags |
| 2.8 | Renovate/Changesets exclusion | Branch ruleset — exclude bot branches from required checks |
| 2.9 | Large preview dependencies | Preview imports — flag files with >20 exports or >500 lines |
| 2.10 | Workflow optimizations | CI concurrency settings + label auto-removal step |

### Step 3: Generate Audit Report

After completing all checks, generate a findings table with pass/fail status and actions taken. See `references/audit-checks.md` for the report template.

## Critical Rules

1. **Stick to documented Chromatic options** — inventing undocumented flags can silently break TurboSnap or produce invalid builds
2. **Run Chromatic from CI only** — local runs trigger the entire visual test suite and waste snapshots against the monthly budget
3. **Preserve TurboSnap** — TurboSnap is the primary cost-saving mechanism; every recommendation should maintain its effectiveness
4. **Cost awareness** — every snapshot counts toward the monthly budget, so always consider the snapshot cost impact of changes

## Reference Guide

For detailed documentation beyond the workflow above, consult:

- **`references/audit-checks.md`** — Full check procedures with code examples, detection patterns, fix actions, and the audit report template
- **`references/background.md`** — TurboSnap preservation rules, snapshot cost multipliers, CI trigger strategy, monorepo-specific checks
