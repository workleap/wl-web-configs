---
order: 100
label: Migrate from ESLint
meta:
    title: Migrate from ESLint - oxlint & oxfmt
toc:
    depth: 2-3
---

# Migrate from ESLint

`@workleap/eslint-configs` is deprecated in favor of [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for formatting. Both tools are part of the [Oxc](https://oxc.rs/) project. They run much faster than ESLint and don't need a stack of plugins and parsers.

There is **no shared Workleap oxlint or oxfmt configuration package**. Each project owns its `oxlint.config.ts` and `oxfmt.config.ts` files. This guide gives you a reference setup to copy and adapt: the one [this repository](https://github.com/workleap/wl-web-configs/blob/main/oxlint.config.ts) uses, without its repository-specific parts. It doesn't reproduce the `@workleap/eslint-configs` rules one by one: it relies on oxlint's rule categories instead, and lists the [gaps](#known-gaps).

To migrate from [@workleap/eslint-configs](https://www.npmjs.com/package/@workleap/eslint-configs), execute the following steps :point_down:

## Update packages

Open a terminal at the root of the project (the root of the repository for a monorepo) and install the following packages:

```bash
pnpm add -D oxlint oxfmt oxlint-tsgolint
```

`oxlint-tsgolint` runs the type-aware rules (the equivalent of the type-checked typescript-eslint rules). You can skip it if you turn off [type-aware linting](#type-aware-linting).

Then, using the same terminal, remove the following packages:

```bash
pnpm remove @workleap/eslint-configs eslint @eslint/js typescript-eslint @typescript-eslint/parser
```

For a monorepo, run the same command in every project of the workspace. Remove any other `eslint-plugin-*` or `@eslint/*` package that you installed yourself, unless you load it as a [JS plugin](#storybook-and-testing-library).

!!!info
Keep `typescript`: oxlint doesn't need it, but your type checking, build and tests still do. If the project uses [@workleap/stylelint-configs](../stylelint/getting-started.md), also keep `prettier`: Stylelint still formats CSS files with it.
!!!

## Update files

```
project
├── eslint.config.ts   -->  oxlint.config.ts
├── oxfmt.config.ts    (new)
├── .prettierignore    -->  X
├── .prettierrc.json5  (new, only for projects using @workleap/stylelint-configs)
├── .editorconfig
├── .vscode
├──── settings.json
├──── extensions.json
├── package.json
├── turbo.json         (monorepo only)
```

For a monorepo, delete the `eslint.config.ts` file of **every** project. oxlint and oxfmt run **once** from the root of the workspace with a single configuration file each.

!!!warning
The `oxlint.config.ts` and `oxfmt.config.ts` files are ES modules. If the closest `package.json` file doesn't have `"type": "module"`, oxlint fails with `SyntaxError: Cannot use import statement outside a module` (and oxfmt prints a warning). Either add `"type": "module"` or name the files `oxlint.config.mts` and `oxfmt.config.mts`.
!!!

### `oxlint.config.ts`

Create an `oxlint.config.ts` file at the root of the project and copy/paste the following content. It's meant for React projects tested with Vitest, the equivalent of `defineWebApplicationConfig` and `defineReactLibraryConfig`:

```ts oxlint.config.ts
import { defineConfig } from "oxlint";

export default defineConfig({
    // oxlint also honors .gitignore (dist, storybook-static, ...).
    // - .agents/ holds the vendored agent skills: upstream replaces them wholesale.
    // - mockServiceWorker.js is MSW's generated worker (`msw init`).
    ignorePatterns: [".agents/**", "**/mockServiceWorker.js"],
    // Setting `plugins` overwrites oxlint's default plugin set (eslint, typescript, unicorn, oxc),
    // so the defaults must be listed explicitly alongside the extras.
    plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "react-perf", "import", "jsx-a11y", "promise", "vitest"],
    // Type-aware rules run through oxlint-tsgolint, like the type-checked typescript-eslint rules
    // @workleap/eslint-configs enabled.
    options: { typeAware: true },
    categories: {
        suspicious: "warn",
        perf: "warn"
    },
    rules: {
        "oxc/no-barrel-file": "warn",
        // It replaces a spread by Object.assign, which mutates the source object rather than cloning it.
        "oxc/no-map-spread": "off",
        "unicorn/consistent-function-scoping": "off",
        "eslint/array-callback-return": "warn",
        "eslint/curly": "warn",
        "eslint/eqeqeq": ["warn", "smart"],
        "eslint/no-caller": "warn",
        "eslint/no-console": "off",
        "eslint/no-eval": "warn",
        "eslint/no-extend-native": "warn",
        "eslint/no-extra-bind": "warn",
        "eslint/no-lone-blocks": "warn",
        "eslint/no-loop-func": "warn",
        "eslint/no-new-wrappers": "warn",
        "eslint/no-param-reassign": "warn",
        "eslint/no-script-url": "warn",
        "eslint/no-self-compare": "warn",
        "eslint/no-sequences": "warn",
        "eslint/no-template-curly-in-string": "warn",
        "eslint/no-throw-literal": "warn",
        "eslint/no-unneeded-ternary": "warn",
        "eslint/no-useless-computed-key": "warn",
        "eslint/no-useless-concat": "warn",
        "eslint/no-useless-constructor": "warn",
        "eslint/no-useless-rename": "warn",
        "eslint/no-var": "warn",
        "eslint/prefer-const": "warn",
        "import/no-cycle": "warn",
        "import/no-duplicates": "warn",
        "import/no-self-import": "warn",
        // Flags side-effect imports such as `import "./styles.css";`.
        "import/no-unassigned-import": "off",
        "react/button-has-type": "warn",
        "react/jsx-key": "warn",
        "react/jsx-no-constructed-context-values": "warn",
        "react/jsx-no-duplicate-props": "warn",
        "react/no-array-index-key": "warn",
        "react/react-in-jsx-scope": "off",
        "react/rules-of-hooks": "warn",
        "react/exhaustive-deps": "warn",
        // They report the same missing dependencies as react/exhaustive-deps.
        "react/exhaustive-effect-dependencies": "off",
        "react/memo-dependencies": "off",
        "react-perf/jsx-no-new-function-as-prop": "off",
        "typescript/consistent-type-imports": "warn",
        "typescript/no-import-type-side-effects": "error",
        "typescript/no-explicit-any": "warn",
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/consistent-return": "off",
        "typescript/no-misused-promises": ["warn", { checksVoidReturn: { attributes: false } }],
        "typescript/return-await": "warn",
        // A `default` branch is a deliberate catch-all; only a switch that can fall through is a finding.
        "typescript/switch-exhaustiveness-check": ["warn", { considerDefaultExhaustiveForUnions: true }],
        "typescript/use-unknown-in-catch-callback-variable": "warn",
        // `vi.fn()` without type parameters is fine when the test never reads the mock's arguments back.
        "vitest/require-mock-type-parameters": "off",
        "jsx-a11y/no-autofocus": "off",
        "jsx-a11y/anchor-is-valid": "warn"
    },
    overrides: [
        {
            files: ["**/*.test.{ts,tsx}"],
            rules: {
                "typescript/no-explicit-any": "off",
                // `expect(spy.method)` reads the method unbound by design.
                "typescript/unbound-method": "off"
            }
        },
        {
            files: ["**/*.stories.tsx", "**/.storybook/**"],
            rules: {
                "react-perf/jsx-no-jsx-as-prop": "off",
                "react-perf/jsx-no-new-object-as-prop": "off"
            }
        }
    ]
});
```

Most rules are warnings. The `oxlint` [script](#packagejson) passes `--deny-warnings`, so a warning fails the lint like an error does, while the editor still shows it as a warning.

The configuration also enables rules that `@workleap/eslint-configs` didn't have: the `suspicious` and `perf` categories, the `react-perf`, `unicorn`, `oxc` and `promise` plugins, and rules such as `import/no-cycle` and `typescript/consistent-type-imports`. Expect new findings, and turn off the rules that don't fit your codebase.

#### Adapt it to your project type

| Old configuration | Changes to the reference `oxlint.config.ts` |
| --- | --- |
| `defineWebApplicationConfig` | None. |
| `defineReactLibraryConfig` | None. |
| `defineTypeScriptLibraryConfig` | Remove `react`, `react-perf` and `jsx-a11y` from `plugins`, remove the `react/*`, `react-perf/*` and `jsx-a11y/*` rules, and remove the Storybook override. |
| `defineMonorepoWorkspaceConfig` | Not needed anymore: a single root `oxlint.config.ts` lints the whole workspace. See [Monorepo](#monorepo). |

#### Port your custom rules

If your `eslint.config.ts` file added or changed rules, port them to `rules` or `overrides`. oxlint uses a plugin prefix for every rule:

| ESLint | oxlint |
| --- | --- |
| `no-console` (core rules) | `eslint/no-console` |
| `@typescript-eslint/*` | `typescript/*` |
| `react-hooks/*` | `react/*` |
| `import/*`, `jsx-a11y/*`, `vitest/*`, `jest/*` | Unchanged |

#### Jest instead of Vitest

If the project's tests run with [Jest](https://jestjs.io/) (`testFramework: "jest"`), replace `vitest` with `jest` in `plugins`, and remove the `vitest/require-mock-type-parameters` rule.

#### Monorepo

A single root `oxlint.config.ts` lints every project of the workspace. Use `overrides` for the plugins and rules that only apply to some projects. For example, when most projects test with Vitest but a legacy application tests with Jest, remove `vitest` from the root `plugins` and enable each test plugin where its runner is used:

```ts oxlint.config.ts
overrides: [
    {
        files: ["packages/**", "apps/web/**"],
        plugins: ["vitest"],
        rules: {
            "vitest/require-mock-type-parameters": "off"
        }
    },
    {
        files: ["apps/legacy-app/**"],
        plugins: ["jest"]
    }
]
```

- Don't enable `vitest` and `jest` for the same files: the two plugins share most rules, so every finding would be reported twice.
- Configure a plugin's rules in the override that enables it. oxlint ignores the settings of a later override for those rules.

#### Type-aware linting

With `options.typeAware: true`, oxlint runs the type-aware rules through `oxlint-tsgolint`, which reads each project's `tsconfig.json` file. It's slower than the rest of oxlint, but faster than typescript-eslint. To turn it off, remove `options.typeAware` and uninstall `oxlint-tsgolint`: oxlint then skips the type-aware rules.

!!!warning
In a monorepo, the type-aware rules resolve the workspace packages like a consumer would. When a package's `exports` or `types` point to its `dist` folder and the package isn't built, they silently report less instead of failing. Build the packages before running oxlint, locally and in [CI](#ci).
!!!

#### Storybook and Testing Library

oxlint has no native port of `eslint-plugin-storybook` and `eslint-plugin-testing-library`, so the reference configuration doesn't include their rules. To keep them, load the original ESLint plugins as [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html), which run ESLint rules inside oxlint. JS plugins are in alpha and not subject to semver.

First, install the plugins the project needs:

```bash
pnpm add -D eslint-plugin-storybook eslint-plugin-testing-library
```

Then, add them to `jsPlugins` and add the rules of their recommended presets to `overrides`:

```ts !#3,9-49 oxlint.config.ts
export default defineConfig({
    plugins: [...],
    jsPlugins: ["eslint-plugin-storybook", "eslint-plugin-testing-library"],
    ...
    overrides: [
        ...
        // eslint-plugin-testing-library "flat/react" preset.
        {
            files: ["**/*.test.{ts,tsx}"],
            rules: {
                "testing-library/await-async-events": ["error", { eventModule: "userEvent" }],
                "testing-library/await-async-queries": "error",
                "testing-library/await-async-utils": "error",
                "testing-library/no-await-sync-events": ["error", { eventModules: ["fire-event"] }],
                "testing-library/no-await-sync-queries": "error",
                "testing-library/no-container": "error",
                "testing-library/no-debugging-utils": "warn",
                "testing-library/no-dom-import": ["error", "react"],
                "testing-library/no-global-regexp-flag-in-query": "error",
                "testing-library/no-manual-cleanup": "error",
                "testing-library/no-node-access": "error",
                "testing-library/no-promise-in-fire-event": "error",
                "testing-library/no-render-in-lifecycle": "error",
                "testing-library/no-unnecessary-act": "error",
                "testing-library/no-wait-for-multiple-assertions": "error",
                "testing-library/no-wait-for-side-effects": "error",
                "testing-library/no-wait-for-snapshot": "error",
                "testing-library/prefer-find-by": "error",
                "testing-library/prefer-presence-queries": "error",
                "testing-library/prefer-query-by-disappearance": "error",
                "testing-library/prefer-screen-queries": "error",
                "testing-library/render-result-naming-convention": "error"
            }
        },
        // eslint-plugin-storybook "flat/recommended" preset.
        {
            files: ["**/*.stories.{ts,tsx}"],
            rules: {
                "react/rules-of-hooks": "off",
                "storybook/await-interactions": "error",
                "storybook/context-in-play-function": "error",
                "storybook/default-exports": "error",
                "storybook/hierarchy-separator": "warn",
                "storybook/no-redundant-story-name": "warn",
                "storybook/no-renderer-packages": "error",
                "storybook/prefer-pascal-case": "warn",
                "storybook/story-exports": "error",
                "storybook/use-storybook-expect": "error",
                "storybook/use-storybook-testing-library": "error"
            }
        },
        {
            files: ["**/.storybook/main.{js,ts}"],
            rules: {
                "storybook/no-uninstalled-addons": "warn"
            }
        }
    ]
});
```

If the project only has stories or only uses Testing Library, keep only that plugin and its overrides. The Testing Library rules above are those of the React preset: if some tests use `@testing-library/dom` directly, remove `no-dom-import` for those files.

### `oxfmt.config.ts`

oxfmt replaces the stylistic rules of `@workleap/eslint-configs` (`@stylistic`, `eslint-plugin-jsonc`) and the `package.json` sorting of `eslint-plugin-package-json`. It formats JavaScript, TypeScript, JSON, YAML, Markdown, HTML and CSS files.

Create an `oxfmt.config.ts` file at the root of the project and copy/paste the following content. It keeps the style of `@workleap/eslint-configs`: 4 spaces, double quotes, semicolons and no trailing commas:

```ts oxfmt.config.ts
import { defineConfig } from "oxfmt";

export default defineConfig({
    // oxfmt also honors .gitignore (dist, storybook-static, ...) and would honor a .prettierignore.
    // - CSS is formatted by Prettier through stylelint-prettier (.prettierrc.json5). oxfmt doesn't always produce the
    //   same CSS (`calc(a*2)` keeps no spaces around `*`), so two formatters would reject each other's output.
    // - .agents/ and skills-lock.json are the vendored agent skills: upstream replaces them wholesale.
    // - CHANGELOG.md files are generated by Changesets.
    ignorePatterns: ["**/*.css", ".agents/", "skills-lock.json", "pnpm-lock.yaml", "**/CHANGELOG.md", "**/mockServiceWorker.js"],
    printWidth: 150,
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    jsxSingleQuote: false,
    semi: true,
    trailingComma: "none",
    arrowParens: "avoid",
    bracketSpacing: true,
    bracketSameLine: false,
    quoteProps: "as-needed",
    endOfLine: "lf",
    sortPackageJson: {
        sortScripts: false
    },
    overrides: [
        {
            // YAML files, such as GitHub workflows, are indented with 2 spaces.
            files: ["**/*.yml", "**/*.yaml"],
            options: { tabWidth: 2 }
        },
        {
            // Code fences often show other files, such as 2-space GitHub workflows: format the prose only.
            files: ["**/*.md"],
            options: { embeddedLanguageFormatting: "off" }
        }
    ]
});
```

- **`printWidth`**: `@workleap/eslint-configs` had no maximum line length. With `150`, oxfmt wraps long lines and joins multi-line code that fits on one line (objects keep their line breaks). In this repository, `150`, `200` and `300` changed about as many lines.
- **CSS**: if the project doesn't use [@workleap/stylelint-configs](../stylelint/getting-started.md), remove `"**/*.css"` from `ignorePatterns` to format CSS files with oxfmt (and from the `//#oxfmt:check` [inputs](#turbojson) in a monorepo).
- **Markdown**: oxfmt also formats Markdown files, which ESLint didn't (`*` lists become `-`, tables are padded, etc.). Ignore the folders where that doesn't fit: documentation sites with their own syntax, such as [Retype](https://retype.com/) (`!!!` callouts), or agent skills, where padded tables cost context.
- **Tailwind CSS**: if the project uses [Tailwind CSS](https://tailwindcss.com/), add `sortTailwindcss: {}` to sort the classes.

!!!info
oxfmt sorts the keys of every `package.json` file, which `@workleap/eslint-configs` didn't do (it only sorted the dependencies), so the first run reorders them. `sortScripts: false` keeps the scripts in their current order. Set `sortPackageJson: false` to opt out entirely.
!!!

### `.prettierignore`

!!!warning
Delete the `.prettierignore` file at the root of the project. oxfmt reads it by default, and the file recommended by the [Stylelint guide](../stylelint/getting-started.md) ignores everything but CSS files: oxfmt would then skip every file and report `Expected at least one target file`.
!!!

Use `ignorePatterns` in `oxfmt.config.ts` instead.

In a monorepo, oxfmt only reads the root `.prettierignore` file. Delete the projects' own `.prettierignore` files too, or, to keep them, make sure they re-include the folders. Otherwise Prettier ignores the CSS files in subfolders and Stylelint silently stops checking their formatting:

```text .prettierignore
# Prettier only runs through stylelint-prettier, on CSS. "!*/" re-includes the folders, otherwise the CSS files under them stay ignored.
*
!*/
!*.css
```

### `.prettierrc.json5`

Skip this step if the project doesn't use [@workleap/stylelint-configs](../stylelint/getting-started.md).

`@workleap/stylelint-configs` includes the [stylelint-prettier](https://github.com/prettier/stylelint-prettier) plugin, which formats CSS files with Prettier, not oxfmt. Prettier reads its own configuration file (and `.editorconfig`), not `oxfmt.config.ts`. Without one, it falls back to Prettier's defaults, such as 80 characters per line.

Create a `.prettierrc.json5` file at the root of the project with a CSS-scoped override that uses the options of `oxfmt.config.ts`, so CSS looks like the rest of the code:

```json5 .prettierrc.json5
// @workleap/stylelint-configs enables stylelint-prettier, which hands CSS to Prettier itself, not oxfmt.
// Prettier resolves its own config: without this file it falls back to its defaults (printWidth: 80, tabWidth: 2).
//
// oxfmt ignores CSS, so Prettier is the only CSS formatter. The CSS-scoped override uses the options of
// oxfmt.config.ts so CSS looks like the rest of the code. Keep them in sync.
{
    $schema: "https://json.schemastore.org/prettierrc",
    overrides: [
        {
            files: "*.css",
            options: {
                printWidth: 150,
                tabWidth: 4,
                useTabs: false,
                singleQuote: false,
                endOfLine: "lf"
            }
        }
    ]
}
```

To fix the formatting of CSS files, run Stylelint with `--fix`.

### `.editorconfig`

The [Stylelint guide](../stylelint/getting-started.md) sets `indent_size = 4` for every file, while `oxfmt.config.ts` indents YAML files with 2 spaces. Add a YAML section to the `.editorconfig` file so the editor agrees with oxfmt:

```ini .editorconfig
[*.{yml,yaml}]
indent_size = 2
```

### `package.json`

Replace the ESLint script of the project (`eslint` or `lint:eslint`) with the following scripts:

```json package.json
{
    "scripts": {
        "oxlint": "oxlint --deny-warnings --report-unused-disable-directives-severity=error",
        "oxfmt": "oxfmt",
        "oxfmt:check": "oxfmt --check"
    }
}
```

- `--deny-warnings` fails the lint on warnings, like ESLint's `--max-warnings=0`. `--report-unused-disable-directives-severity=error` fails it on the `eslint-disable` and `oxlint-disable` comments that don't suppress anything.
- `oxfmt` formats the files in place and `oxfmt:check` only reports the files that aren't formatted, for CI.
- Formatting isn't part of linting anymore: where you ran `eslint --fix` to format, run `pnpm oxfmt`. `oxlint --fix` still fixes oxlint's own rules.

For a polyrepo, make sure the `lint` script still runs oxlint and `oxfmt:check`: CI runs `pnpm lint`. If it runs every `lint:*` script (e.g. `pnpm run "/^lint:.*/"`), name the scripts `lint:oxlint` and `lint:oxfmt` instead.

For a monorepo, add these scripts to the root `package.json` file and delete the ESLint script of every project. If oxlint is [type-aware](#type-aware-linting), also build the packages before linting. For example, a `prelint` script runs before `pnpm lint` (but not before `pnpm oxlint`):

```json package.json
{
    "scripts": {
        "prelint": "turbo run build --filter=./packages/*"
    }
}
```

Also update the Git hooks (`lint-staged`, husky, etc.) that run ESLint.

### `turbo.json`

For a monorepo managed with [Turborepo](https://turborepo.com/), replace the `eslint` and `//#eslint` tasks with root tasks. In the `dependsOn` list of the `lint` task, replace `eslint` with `//#oxlint` and `//#oxfmt:check`, and keep the other dependencies:

```json !#5,7-14 turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
        "lint": {
            "dependsOn": ["//#oxlint", "//#oxfmt:check", "stylelint", "typecheck"]
        },
        "//#oxlint": {
            "inputs": ["$TURBO_DEFAULT$", "!**/*.md", "!**/*.css"],
            "outputs": []
        },
        "//#oxfmt:check": {
            "inputs": ["$TURBO_DEFAULT$", "!**/*.css"],
            "outputs": []
        }
    }
}
```

oxlint and oxfmt process the whole workspace in a single run, so there is no per-project task anymore. The inputs of a root task include the files of every project, so a change anywhere in the workspace runs the tasks again.

If the project uses `@workleap/stylelint-configs`, also add `.prettierrc.json5` to `globalDependencies`: it configures Stylelint in every project, so a change to it should run Stylelint everywhere.

```json turbo.json
{
    "globalDependencies": [".prettierrc.json5"]
}
```

### CI

For a polyrepo following the [CI workflow](../introduction/setup-a-ci-workflow.md) guide, there is nothing to change: the workflow runs `pnpm lint`.

For a monorepo, replace the ESLint step of the [Turborepo CI workflow](../introduction/setup-turborepo-ci-workflow.md) with the root tasks, so CI uses the Turborepo cache:

```yaml .github/workflows/ci.yml
- name: oxlint
  run: |
    pnpm turbo run build --filter=./packages/*
    pnpm turbo run //#oxlint

- name: oxfmt
  run: pnpm turbo run //#oxfmt:check
```

- Both tools process the whole workspace in a single run, so the `--filter=...[<base sha>]` filter doesn't apply anymore.
- With [type-aware](#type-aware-linting) linting, build **every** package before oxlint, not only the ones that changed: the unchanged ones come from the Turborepo cache. Without type-aware linting, remove the build command.

### VS Code

Open VS Code and install the [oxc.oxc-vscode](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) extension, then disable the ESLint extension (`dbaeumer.vscode-eslint`) for the project.

Replace the ESLint settings in the project's `.vscode/settings.json` file (`eslint.probe`, `typescript.format.enable`, `javascript.format.enable`, `json.format.enable` and `source.fixAll`) with:

```json .vscode/settings.json
{
    "oxc.typeAware": true,
    "editor.defaultFormatter": "oxc.oxc-vscode",
    "editor.formatOnSave": true,
    "editor.formatOnSaveMode": "file",
    "editor.codeActionsOnSave": {
        "source.fixAll.oxc": "explicit"
    },
    // oxfmt doesn't format CSS: Stylelint does, through stylelint-prettier and .prettierrc.json5.
    "[css]": {
        "editor.formatOnSave": false,
        "editor.codeActionsOnSave": {
            "source.fixAll.stylelint": "explicit"
        }
    }
}
```

Remove `oxc.typeAware` if you turned off [type-aware linting](#type-aware-linting), and remove the `[css]` section if the project doesn't use `@workleap/stylelint-configs`. You can keep `"source.sortImports": "explicit"` in `editor.codeActionsOnSave` if the project had it.

Then, update the recommended extensions in the `.vscode/extensions.json` file:

```json .vscode/extensions.json
{
    "recommendations": ["oxc.oxc-vscode", "stylelint.vscode-stylelint"],
    "unwantedRecommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```

### Agent skills

If you followed the [Use with agents](../introduction/use-with-agents.md) guide, remove the `@workleap/eslint-configs` entry from the `permissions` setting of the `pnpm-workspace.yaml` file.

## Format the codebase

oxfmt doesn't produce the same output as the `@stylistic` rules. For example, it wraps lines longer than `printWidth`, collapses short multi-line arrays, arguments and JSX elements on a single line, and adds a space after anonymous functions (`function () {}`). The first run touches many files, so open a dedicated pull request that only formats the code. If the project uses `@workleap/stylelint-configs`, the new `.prettierrc.json5` can also change the CSS formatting (line length, indentation), so fix the CSS files with Stylelint in the same pull request:

```bash
pnpm oxfmt
pnpm exec stylelint "**/*.css" --fix   # Only with @workleap/stylelint-configs, in every project of a monorepo.
git add -A
git commit -m "chore: format with oxfmt"
```

Once it's merged, add the hash of the formatting commit on the main branch to a `.git-blame-ignore-revs` file at the root of the repository, so `git blame` and GitHub skip it. Don't do it if the formatting was squashed with other changes: their lines would be hidden from `git blame` too.

```text .git-blame-ignore-revs
# Format with oxfmt
<commit-sha>
```

## Fix the remaining issues

Run `pnpm oxlint` and fix the reported issues. A few things to expect:

- oxlint honors the existing `eslint-disable` comments, and understands the `@typescript-eslint/` rule prefix. Comments that don't suppress anything anymore are reported as errors: delete them. This includes comments for rules that don't exist in oxlint (such as `@stylistic/*` rules) and for rules the reference turns off. Write the remaining ones with oxlint's rule names, for example `oxlint-disable-next-line typescript/no-explicit-any`.
- New findings from the categories and plugins that `@workleap/eslint-configs` didn't have, such as `promise/always-return`, `unicorn/*` and `react-perf/*` rules. Fix them, or turn off the rules that don't fit your codebase.

## Rule mapping

| `@workleap/eslint-configs` | oxlint & oxfmt |
| --- | --- |
| Core (`@eslint/js` recommended and extra rules) | `eslint` plugin, the default `correctness` rules and the rules of the reference configuration |
| `eslint-plugin-import` | `import` plugin |
| `typescript-eslint` `recommendedTypeChecked` and `stylisticTypeCheckedOnly` | `typescript` plugin, with `options.typeAware` and `oxlint-tsgolint` for the type-aware rules |
| `eslint-plugin-react` and `eslint-plugin-react-hooks` | `react` plugin (the hooks rules are `react/rules-of-hooks`, `react/exhaustive-deps`, etc.) |
| `eslint-plugin-jsx-a11y` | `jsx-a11y` plugin |
| `@vitest/eslint-plugin` | `vitest` plugin |
| `eslint-plugin-jest` | `jest` plugin |
| `eslint-plugin-storybook` | None natively, optional [JS plugin](#storybook-and-testing-library) |
| `eslint-plugin-testing-library` | None natively, optional [JS plugin](#storybook-and-testing-library) |
| `@stylistic/eslint-plugin` and `eslint-plugin-jsonc` | oxfmt |
| `eslint-plugin-yaml` | oxfmt (formatting only) |
| `eslint-plugin-package-json` | oxfmt `sortPackageJson` (sorting only) |
| `@workleap/strict-css-modules-names` | None |

## Known gaps

Compared with `@workleap/eslint-configs`, oxlint `1.92` doesn't have:

- **Native Storybook and Testing Library rules**: the 11 rules of `eslint-plugin-storybook`'s recommended preset and the 22 rules of `eslint-plugin-testing-library`'s React preset only run as [JS plugins](#storybook-and-testing-library), which are in alpha.
- **`@workleap/strict-css-modules-names`**: there is no equivalent to require CSS Modules files to be named after their component.
- **`package.json`, JSON and YAML lint rules**: only formatting remains. oxfmt sorts `package.json` files but doesn't validate them. [Syncpack](../syncpack/setup-turborepo.md) and [knip](https://knip.dev/) cover part of it.
- **PropTypes and class component rules** of `eslint-plugin-react`: `react/prop-types`, `react/default-props-match-prop-types`, `react/forbid-foreign-prop-types`, `react/no-typos`, `react/no-unused-prop-types`, `react/no-unused-state`, `react/no-access-state-in-setstate`, `react/destructuring-assignment` and `react/no-deprecated`. TypeScript covers most of them.

## Try it :rocket:

Run `pnpm oxlint` and `pnpm oxfmt:check`. Both commands should complete without errors. Then, restart VS Code, open a TypeScript file, break its formatting (e.g. remove a semicolon) and save. The file should be formatted again.
