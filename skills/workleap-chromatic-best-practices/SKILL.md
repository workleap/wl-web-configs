---
name: workleap-chromatic-best-practices
description: |
  Audit and update repositories to follow Workleap's Chromatic best practices for snapshot cost control and CI optimization.

  Use this skill when:
  (1) Auditing a repository for Chromatic best practices compliance
  (2) Implementing Chromatic cost optimizations in a project
  (3) Fixing TurboSnap-disabling patterns in code
  (4) Setting up chromatic.config.json with the untraced option
  (5) Updating CI workflows for conditional Chromatic execution
  (6) Refactoring barrel file imports in Storybook preview files
  (7) Reviewing PRs for Chromatic cost impact
  (8) Setting up Chromatic in a new Turborepo project
---

# Workleap Chromatic Best Practices

Guide for auditing and updating repositories to follow Workleap's Chromatic best practices.

## Audit Workflow

When asked to audit or update a repository for Chromatic best practices, follow these steps in order:

### Step 1: Locate Chromatic Configuration

Search for existing Chromatic setup:

```
chromatic.config.json
.storybook/preview.ts
.storybook/preview.tsx
.github/workflows/*chromatic*.yml
.github/workflows/*storybook*.yml
```

If no Chromatic configuration exists, ask the user if they want to set it up.

### Step 2: Audit and Fix Each Practice

#### 2.1 Check `untraced` Configuration

**Find:** `chromatic.config.json`

**Required configuration:**

```json
{
    "$schema": "https://www.chromatic.com/config-file.schema.json",
    "untraced": ["**/package.json"]
}
```

**Action if missing:** Create or update `chromatic.config.json` with the `untraced` option.

**Why:** Package.json changes trigger full builds but rarely affect visual output.

#### 2.2 Audit Storybook Preview Imports

**Find:** `.storybook/preview.ts` or `.storybook/preview.tsx`

**Look for barrel file imports:**

```ts
// BAD - barrel file import triggers full build when ANY export changes
import { ThemeProvider, I18nProvider } from "@app/providers";
import { something } from "../src";
import { util } from "@app/utils";
```

**Replace with direct imports:**

```ts
// GOOD - direct imports only trigger rebuilds for specific file changes
import { ThemeProvider } from "@app/providers/ThemeProvider";
import { I18nProvider } from "@app/providers/I18nProvider";
```

**Detection patterns:**
- Imports from paths ending in `/index` (explicit or implicit)
- Imports from package-level paths like `@app/utils` or `../src`
- Multiple named imports from a single module (often indicates barrel)

**Action:** Refactor to direct imports. If the direct path doesn't exist, note it as a recommendation.

#### 2.3 Check CI Workflow for Conditional Execution

**Find:** GitHub Actions workflow files that run Chromatic

**Required pattern - label-based triggering:**

```yaml
on:
  pull_request:
    types: [labeled, synchronize]

jobs:
  chromatic:
    if: contains(github.event.pull_request.labels.*.name, 'ready-for-chromatic')
    # or similar label-based condition
```

**Bad patterns to fix:**

```yaml
# BAD - runs on every PR
on:
  pull_request:

# BAD - runs on every push
on:
  push:
    branches: [main]
```

**Action:** Update workflow to use label-based triggering. Common label names: `ready-for-chromatic`, `chromatic`, `visual-review`.

#### 2.4 Check Browser Configuration

**Find:** Chromatic CLI flags in CI workflow or `chromatic.config.json`

**Look for multi-browser flags:**

```yaml
# BAD - doubles/triples snapshot count
npx chromatic --browsers chrome,firefox
npx chromatic --browsers chrome,safari,firefox
```

**Required:** Chrome only (default, no flag needed)

```yaml
# GOOD - single browser
npx chromatic
```

**Action:** Remove multi-browser flags unless explicitly required by the project.

#### 2.5 Identify Large Files in Preview Dependencies

**Scan files imported by `.storybook/preview.ts[x]`** for problematic patterns:

**Problematic file types:**
- Localization files (`**/resources.json`, `**/translations/*.json`)
- Route definitions (large route config objects)
- Environment configs
- Utility files with many exports

**Detection:** Files with >20 exports or >500 lines that are imported by preview.

**Action:** Document findings and recommend splitting into smaller, focused modules.

### Step 3: Generate Audit Report

After completing the audit, provide a summary:

```markdown
## Chromatic Best Practices Audit

### Findings

| Practice | Status | Action Required |
|----------|--------|-----------------|
| `untraced` config | ✅/❌ | [action if needed] |
| Preview imports | ✅/❌ | [action if needed] |
| CI label trigger | ✅/❌ | [action if needed] |
| Browser config | ✅/❌ | [action if needed] |
| Large file deps | ✅/❌ | [action if needed] |

### Changes Made
- [list of files modified]

### Recommendations
- [list of suggested improvements that require user decision]
```

## Reference: Why These Practices Matter

### TurboSnap Preservation

TurboSnap analyzes Git changes to snapshot only affected stories. These patterns disable TurboSnap and trigger full builds (all stories):

| Change Type | Files |
|-------------|-------|
| Storybook preview | `.storybook/preview.ts[x]` |
| Barrel file dependencies | Any `index.ts[x]` imported by preview |
| Package dependencies | `**/package.json` |
| Large shared files | Routes, constants, localization |

### Snapshot Cost Multipliers

| Configuration | Snapshots per Story |
|---------------|---------------------|
| Chrome only | 1x |
| Chrome + Safari | 2x |
| Chrome + Safari + Firefox | 3x |

### CI Trigger Strategy

Running Chromatic on every PR commit wastes snapshots on work-in-progress. Label-based triggering:
- Developers add label when PR is ready for visual review
- Prevents snapshot waste on draft/WIP PRs
- Typical labels: `ready-for-chromatic`, `visual-review`

## Monorepo-Specific Audit

For Turborepo/monorepo projects, additional checks:

1. **Per-package Chromatic configs:** Each package with Storybook should have its own `chromatic.config.json`

2. **Filtered CI runs:** Workflow should use Turborepo filtering:
   ```yaml
   - run: pnpm turbo run chromatic --filter="...[origin/main]"
   ```

3. **Module-level triggering:** Changes to shared packages should only trigger Chromatic for dependent modules

## Critical Rules

1. **Never invent Chromatic options** - Only use documented configuration
2. **CI-only execution** - Never recommend running Chromatic locally
3. **Preserve TurboSnap** - Every recommendation should maintain TurboSnap effectiveness
4. **Cost awareness** - Every snapshot counts toward monthly budget
