# Migrate from ESLint 8

Projects still on `@workleap/eslint-plugin` (ESLint 8, `.eslintrc.json`) must move to `@workleap/eslint-configs` (ESLint 9 flat config).

### 1. Update the packages

Run in each location that had the old plugin (polyrepo root, monorepo workspace root, and every project):

```bash
pnpm remove -D @workleap/eslint-plugin @typescript-eslint/parser eslint
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint
```

### 2. Replace the configuration files

Copy the custom rules out of `.eslintrc.json` and the ignore entries out of `.eslintignore`, then delete both files and create an `eslint.config.ts` in their place:

```ts
// eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname);
```

Use `defineMonorepoWorkspaceConfig` at a monorepo workspace root, and the matching project-type function in each project. Reapply the copied rules through the [customization](../SKILL.md#customization) options and `globalIgnores`.

### 3. Update VS Code

Remove any existing `eslint.validate` setting from `.vscode/settings.json` to avoid conflicts, then apply the [VS Code settings](../SKILL.md#vs-code-integration).

Expect **more** warnings and errors after migrating: the ESLint 8 shared configurations had bugs and many rules were not being applied correctly.
