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

There is **no shared Workleap oxlint or oxfmt configuration package**. Each project owns its `oxlint.config.ts` and `oxfmt.config.ts` files. This guide gives you a reference setup to copy and adapt. It reproduces the rules of the `@workleap/eslint-configs` configurations as closely as oxlint allows, and lists the [gaps](#known-gaps).

To migrate from [@workleap/eslint-configs](https://www.npmjs.com/package/@workleap/eslint-configs), execute the following steps :point_down:

## Update packages

Open a terminal at the root of the project (the root of the repository for a monorepo) and install the following packages:

```bash
pnpm add -D oxlint oxfmt oxlint-tsgolint
```

`oxlint-tsgolint` runs the type-aware rules (the equivalent of typescript-eslint's `recommendedTypeChecked` configuration). You can skip it if you turn off [type-aware linting](#type-aware-linting).

If the project has [Storybook](https://storybook.js.org/) stories or uses [Testing Library](https://testing-library.com/), also install the ESLint plugins that oxlint loads as [JS plugins](#storybook-and-testing-library):

```bash
pnpm add -D eslint-plugin-storybook eslint-plugin-testing-library
```

Then, using the same terminal, remove the following packages:

```bash
pnpm remove @workleap/eslint-configs eslint @eslint/js typescript-eslint @typescript-eslint/parser
```

For a monorepo, also remove `@workleap/eslint-configs` and `eslint` from every project of the workspace. Remove any other `eslint-plugin-*` or `@eslint/*` package that you installed yourself, except the two JS plugins above.

!!!info
Keep `typescript`. oxlint doesn't need it, but your type checking, build and tests still do.
!!!

## Update files

```
project
├── eslint.config.ts   -->  oxlint.config.ts
├── oxfmt.config.ts    (new)
├── .prettierignore    -->  X
├── .prettierrc.json5  (new, only for projects using @workleap/stylelint-configs)
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

Create an `oxlint.config.ts` file at the root of the project and copy/paste the following content. It's the equivalent of `defineWebApplicationConfig` and `defineReactLibraryConfig` with Vitest:

```ts oxlint.config.ts
import { defineConfig } from "oxlint";

export default defineConfig({
    ignorePatterns: ["**/dist/**", "**/storybook-static/**", "**/__snapshots__/**", "**/mockServiceWorker.js"],
    // Setting "plugins" replaces oxlint's default set (eslint, typescript, unicorn, oxc),
    // so the defaults must be listed alongside the extra plugins.
    plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "react", "jsx-a11y", "promise", "vitest"],
    // ESLint plugins without a native oxlint port. JS plugins are in alpha, remove them if you don't need them.
    jsPlugins: ["eslint-plugin-storybook", "eslint-plugin-testing-library"],
    options: {
        // Type-aware rules, the equivalent of typescript-eslint "recommendedTypeChecked". Requires "oxlint-tsgolint".
        typeAware: true,
        // Fail on warnings, like ESLint's "--max-warnings=0".
        denyWarnings: true,
        reportUnusedDisableDirectives: "error"
    },
    categories: {
        correctness: "error",
        suspicious: "warn",
        perf: "warn"
    },
    rules: {
        // Core
        "eslint/array-callback-return": "error",
        "eslint/curly": "warn",
        "eslint/eqeqeq": ["warn", "smart"],
        "eslint/no-array-constructor": "warn",
        "eslint/no-caller": "warn",
        "eslint/no-case-declarations": "error",
        "eslint/no-cond-assign": ["error", "except-parens"],
        "eslint/no-empty": "error",
        "eslint/no-eval": "warn",
        "eslint/no-extend-native": "warn",
        "eslint/no-extra-bind": "warn",
        "eslint/no-extra-label": "warn",
        "eslint/no-fallthrough": "error",
        "eslint/no-implied-eval": "warn",
        "eslint/no-iterator": "warn",
        "eslint/no-label-var": "warn",
        "eslint/no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
        "eslint/no-lone-blocks": "warn",
        "eslint/no-multi-str": "warn",
        "eslint/no-new-func": "warn",
        "eslint/no-new-wrappers": "warn",
        "eslint/no-param-reassign": "warn",
        "eslint/no-redeclare": "error",
        "eslint/no-regex-spaces": "error",
        "eslint/no-script-url": "warn",
        "eslint/no-self-compare": "error",
        "eslint/no-sequences": "warn",
        // Turned off for TypeScript files in @workleap/eslint-configs.
        "eslint/no-shadow": "off",
        "eslint/no-template-curly-in-string": "error",
        "eslint/no-throw-literal": "warn",
        "eslint/no-unneeded-ternary": "warn",
        "eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],
        "eslint/no-useless-computed-key": "warn",
        "eslint/no-useless-concat": "warn",
        "eslint/no-useless-rename": "warn",
        "eslint/no-var": "warn",
        "eslint/prefer-const": "warn",
        "eslint/prefer-rest-params": "error",
        "eslint/prefer-spread": "error",
        "eslint/unicode-bom": ["warn", "never"],

        // Imports
        "import/newline-after-import": "warn",
        "import/no-amd": "error",
        "import/no-duplicates": "warn",
        "import/no-self-import": "error",
        // Flags side-effect imports such as `import "./styles.css";`.
        "import/no-unassigned-import": "off",
        "import/no-webpack-loader-syntax": "error",

        // TypeScript
        "typescript/ban-ts-comment": "error",
        "typescript/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends", allowObjectTypes: "never" }],
        "typescript/no-explicit-any": "error",
        "typescript/no-namespace": "error",
        "typescript/no-require-imports": "error",
        "typescript/no-unsafe-function-type": "error",
        "typescript/non-nullable-type-assertion-style": "error",
        "typescript/prefer-find": "error",
        "typescript/prefer-includes": "error",
        "typescript/prefer-regexp-exec": "error",
        "typescript/prefer-string-starts-ends-with": "error",
        "typescript/require-await": "error",
        "typescript/restrict-plus-operands": "error",
        // Turned off in @workleap/eslint-configs.
        "typescript/no-base-to-string": "off",
        "typescript/no-floating-promises": "off",
        "typescript/restrict-template-expressions": "off",
        "typescript/unbound-method": "off",

        // React (includes the react-hooks rules)
        "react/button-has-type": "warn",
        "react/exhaustive-deps": "warn",
        "react/jsx-boolean-value": ["warn", "never"],
        "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".tsx"] }],
        "react/jsx-key": "off",
        "react/jsx-no-duplicate-props": "warn",
        "react/jsx-no-target-blank": "error",
        "react/jsx-pascal-case": ["warn", { allowAllCaps: true }],
        "react/no-array-index-key": "warn",
        "react/no-unknown-property": "error",
        "react/react-in-jsx-scope": "off",
        "react/rules-of-hooks": "error",
        "react/set-state-in-effect": "off",
        "react/style-prop-object": "warn",
        // Duplicates of react/exhaustive-deps and react/static-components.
        "react/exhaustive-effect-dependencies": "off",
        "react/memo-dependencies": "off",
        "react/no-unstable-nested-components": "off",
        // React Compiler rules, turn them back on if your project uses the React Compiler.
        "react/incompatible-library": "off",
        "react/preserve-manual-memoization": "off",

        // Accessibility
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/media-has-caption": "off",
        "jsx-a11y/no-autofocus": "off"
    },
    overrides: [
        {
            files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**"],
            rules: {
                "vitest/no-commented-out-tests": "off",
                "vitest/no-focused-tests": "warn",
                "vitest/no-identical-title": "error",
                "vitest/no-import-node-test": "error",
                "vitest/no-interpolation-in-snapshots": "error",
                "vitest/no-mocks-import": "error",
                // Not part of the @vitest/eslint-plugin recommended rules.
                "vitest/require-mock-type-parameters": "off",
                "vitest/require-to-throw-message": "off",
                "vitest/warn-todo": "off"
            }
        },
        // eslint-plugin-testing-library "flat/dom" preset.
        {
            files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**"],
            rules: {
                "testing-library/await-async-events": ["error", { eventModule: "userEvent" }],
                "testing-library/await-async-queries": "error",
                "testing-library/await-async-utils": "error",
                "testing-library/no-await-sync-events": ["error", { eventModules: ["fire-event"] }],
                "testing-library/no-await-sync-queries": "error",
                "testing-library/no-global-regexp-flag-in-query": "error",
                "testing-library/no-node-access": "error",
                "testing-library/no-promise-in-fire-event": "error",
                "testing-library/no-wait-for-multiple-assertions": "error",
                "testing-library/no-wait-for-side-effects": "error",
                "testing-library/no-wait-for-snapshot": "error",
                "testing-library/prefer-find-by": "error",
                "testing-library/prefer-presence-queries": "error",
                "testing-library/prefer-query-by-disappearance": "error",
                "testing-library/prefer-screen-queries": "error"
            }
        },
        // Additional rules of the eslint-plugin-testing-library "flat/react" preset.
        {
            files: ["**/*.test.{jsx,tsx}", "**/__tests__/**/*.{jsx,tsx}"],
            rules: {
                "testing-library/no-container": "error",
                "testing-library/no-debugging-utils": "warn",
                "testing-library/no-dom-import": ["error", "react"],
                "testing-library/no-manual-cleanup": "error",
                "testing-library/no-render-in-lifecycle": "error",
                "testing-library/no-unnecessary-act": "error",
                "testing-library/render-result-naming-convention": "error"
            }
        },
        // eslint-plugin-storybook "flat/recommended" preset.
        {
            files: ["**/*.{stories,story}.{js,jsx,ts,tsx,mjs,cjs}"],
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
            files: ["**/.storybook/main.{js,ts,mjs,cjs}"],
            rules: {
                "storybook/no-uninstalled-addons": "warn"
            }
        }
    ]
});
```

A few rules have a different severity than in `@workleap/eslint-configs`, because their oxlint category sets it. With `denyWarnings`, warnings fail the lint like errors do, so the difference only shows in the output.

#### Adapt it to your project type

| Old configuration | Changes to the reference `oxlint.config.ts` |
| --- | --- |
| `defineWebApplicationConfig` | None. |
| `defineReactLibraryConfig` | None. |
| `defineTypeScriptLibraryConfig` | Remove `react` and `jsx-a11y` from `plugins` and remove the `react/*` and `jsx-a11y/*` rules. Remove `eslint-plugin-storybook` from `jsPlugins` and remove the Storybook overrides. |
| `defineMonorepoWorkspaceConfig` | Not needed anymore: a single root `oxlint.config.ts` lints the whole workspace. See [Monorepo](#monorepo). |

#### Port your custom rules

If your `eslint.config.ts` file added or changed rules, port them to `rules` or `overrides`. oxlint uses a plugin prefix for every rule:

| ESLint | oxlint |
| --- | --- |
| `no-console` (core rules) | `eslint/no-console` |
| `@typescript-eslint/*` | `typescript/*` |
| `react-hooks/*` | `react/*` |
| `import/*`, `jsx-a11y/*`, `vitest/*`, `jest/*` | Unchanged |

If you passed `react: { compiler: true }`, remove the `react/incompatible-library` and `react/preserve-manual-memoization` lines to turn the React Compiler rules back on.

#### Jest instead of Vitest

If the project's tests run with [Jest](https://jestjs.io/) (`testFramework: "jest"`), replace `vitest` with `jest` in `plugins`, and replace the Vitest override with:

```ts oxlint.config.ts
{
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**"],
    rules: {
        "jest/no-commented-out-tests": "off",
        "jest/no-alias-methods": "error",
        "jest/no-deprecated-functions": "error",
        "jest/no-done-callback": "error",
        "jest/no-identical-title": "error",
        "jest/no-interpolation-in-snapshots": "error",
        "jest/no-jasmine-globals": "error",
        "jest/no-mocks-import": "error",
        "jest/no-test-prefixes": "error",
        // Gives better failure messages for array checks.
        "jest/prefer-to-contain": "error",
        // Prefer spies to allow for automatic restoration.
        "jest/prefer-spy-on": "error"
    }
}
```

#### Monorepo

A single root `oxlint.config.ts` lints every project of the workspace. Use `overrides` for the rules that only apply to some projects. For example, when one package of the workspace tests with Jest while the others use Vitest:

```ts oxlint.config.ts
overrides: [
    {
        files: ["packages/legacy-lib/**"],
        plugins: ["jest"],
        rules: {
            "jest/prefer-to-contain": "error",
            "jest/prefer-spy-on": "error"
        }
    }
]
```

#### Type-aware linting

With `options.typeAware: true`, oxlint runs the type-aware rules through `oxlint-tsgolint`, which reads each project's `tsconfig.json` file. It's slower than the rest of oxlint, but faster than typescript-eslint. To turn it off, remove `options.typeAware` and uninstall `oxlint-tsgolint`: oxlint then skips the type-aware rules.

#### Storybook and Testing Library

oxlint has no native port of `eslint-plugin-storybook` and `eslint-plugin-testing-library`. The reference configuration loads them as [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html), which run the original ESLint rules inside oxlint. JS plugins are in alpha and not subject to semver. If the project doesn't have stories or doesn't use Testing Library, remove the plugin from `jsPlugins` and its overrides.

### `oxfmt.config.ts`

oxfmt replaces the stylistic rules of `@workleap/eslint-configs` (`@stylistic`, `eslint-plugin-jsonc`) and the `package.json` sorting of `eslint-plugin-package-json`. It formats JavaScript, TypeScript, JSON, YAML, Markdown, CSS and HTML files.

Create an `oxfmt.config.ts` file at the root of the project and copy/paste the following content. It matches the style of `@workleap/eslint-configs`: 4 spaces, double quotes, semicolons and no trailing commas:

```ts oxfmt.config.ts
import { defineConfig } from "oxfmt";

export default defineConfig({
    ignorePatterns: ["pnpm-lock.yaml", "skills-lock.json", "CHANGELOG.md", "**/mockServiceWorker.js"],
    printWidth: 300,
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    jsxSingleQuote: false,
    semi: true,
    trailingComma: "none",
    arrowParens: "avoid",
    bracketSpacing: true,
    bracketSameLine: false,
    quoteProps: "preserve",
    endOfLine: "lf",
    overrides: [
        {
            // YAML files, such as GitHub workflows, are usually indented with 2 spaces.
            files: ["**/*.{yml,yaml}"],
            options: {
                tabWidth: 2
            }
        }
    ]
});
```

- **`printWidth`**: `@workleap/eslint-configs` had no maximum line length. With `300`, oxfmt rarely wraps a line, but it joins multi-line code that fits on one line (objects keep their line breaks). Lower it if your team prefers wrapped lines.
- **Markdown**: oxfmt also formats Markdown files, which ESLint didn't (`*` lists become `-`, tables are padded, etc.). Add `"**/*.md"` to `ignorePatterns` to leave them alone.
- **Tailwind CSS**: if the project uses [Tailwind CSS](https://tailwindcss.com/), add `sortTailwindcss: {}` to sort the classes.

!!!info
oxfmt sorts the keys of every `package.json` file, which `@workleap/eslint-configs` didn't do (it only sorted the dependencies), so the first run reorders them. Set `sortPackageJson: false` to opt out.
!!!

### `.prettierignore`

!!!warning
Delete the `.prettierignore` file. oxfmt reads `.prettierignore` by default, and the file recommended by the [Stylelint guide](../stylelint/getting-started.md) ignores everything but CSS files: oxfmt would then skip every other file and report `Expected at least one target file`.
!!!

Use `ignorePatterns` in `oxfmt.config.ts` instead.

### `.prettierrc.json5`

Skip this step if the project doesn't use [@workleap/stylelint-configs](../stylelint/getting-started.md).

`@workleap/stylelint-configs` includes the [stylelint-prettier](https://github.com/prettier/stylelint-prettier) plugin, which formats CSS files with Prettier, not oxfmt. Prettier reads its own configuration file. Without one, it falls back to Prettier's defaults (2 spaces, 80 characters) and fights with oxfmt over the CSS files.

Create a `.prettierrc.json5` file at the root of the project with a CSS-scoped override that mirrors `oxfmt.config.ts`:

```json5 .prettierrc.json5
// stylelint-prettier formats CSS with Prettier, which doesn't read oxfmt.config.ts.
// Keep these options in sync with oxfmt.config.ts so both tools produce the same CSS.
{
    $schema: "https://json.schemastore.org/prettierrc",
    overrides: [
        {
            files: "*.css",
            options: {
                printWidth: 300,
                tabWidth: 4,
                useTabs: false,
                endOfLine: "lf"
            }
        }
    ]
}
```

### `package.json`

Replace the ESLint script of the project (`eslint` or `lint:eslint`) with the following scripts:

```json package.json
{
    "scripts": {
        "oxlint": "oxlint",
        "oxfmt": "oxfmt",
        "oxfmt:check": "oxfmt --check"
    }
}
```

- `oxlint` reads `denyWarnings` and `reportUnusedDisableDirectives` from `oxlint.config.ts`, so a bare `oxlint` run, in a terminal or in the editor, behaves like CI.
- `oxfmt` formats the files in place and `oxfmt:check` only reports the files that aren't formatted, for CI.
- Formatting isn't part of linting anymore: where you ran `eslint --fix` to format, run `pnpm oxfmt`. `oxlint --fix` still fixes oxlint's own rules.

For a monorepo, add these scripts to the root `package.json` file and delete the ESLint script of every project.

Also update the Git hooks (`lint-staged`, husky, etc.) that run ESLint.

### `turbo.json`

For a monorepo managed with [Turborepo](https://turborepo.com/), replace the `eslint` and `//#eslint` tasks with root tasks. In the `dependsOn` list of the `lint` task, replace `eslint` with `//#oxlint` and `//#oxfmt:check`, and keep the other dependencies (`stylelint`, `typecheck`, etc.):

```json !#5,8-13 turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
        "lint": {
            "dependsOn": ["//#oxlint", "//#oxfmt:check"]
        },
        "//#oxlint": {
            "cache": false
        },
        "//#oxfmt:check": {
            "cache": false
        }
    }
}
```

oxlint and oxfmt process the whole workspace in a single run, so there is no per-project task anymore. The reference turns caching off; to cache the tasks, list the files they read in their `inputs`.

### CI

Replace the ESLint step of the CI workflow, including the Turborepo one from the [Turborepo CI workflow](../introduction/setup-turborepo-ci-workflow.md) guide, with:

```yaml .github/workflows/ci.yml
- name: oxlint
  run: pnpm oxlint

- name: oxfmt
  run: pnpm oxfmt:check
```

Both tools process the whole workspace in a single run, so the `--filter=...[<base sha>]` filter doesn't apply anymore.

### VS Code

Open VS Code and install the [oxc.oxc-vscode](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) extension, then disable the ESLint extension (`dbaeumer.vscode-eslint`) for the project.

Replace the ESLint settings in the project's `.vscode/settings.json` file (`eslint.probe`, `typescript.format.enable`, `javascript.format.enable`, `json.format.enable` and `source.fixAll`) with:

```json .vscode/settings.json
{
    "oxc.typeAware": true,
    "editor.defaultFormatter": "oxc.oxc-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.oxc": "always",
        "source.sortImports": "explicit"
    }
}
```

Remove `oxc.typeAware` if you turned off [type-aware linting](#type-aware-linting). If the project has a `.vscode/extensions.json` file, replace `dbaeumer.vscode-eslint` with `oxc.oxc-vscode` in its `recommendations`.

### Agent skills

If you followed the [Use with agents](../introduction/use-with-agents.md) guide, remove the `@workleap/eslint-configs` entry from the `permissions` setting of the `pnpm-workspace.yaml` file.

## Format the codebase

oxfmt doesn't produce the same output as the `@stylistic` rules. For example, it collapses short multi-line arrays, arguments and JSX elements on a single line, and adds a space after anonymous functions (`function () {}`). The first run touches many files, so do it in a dedicated commit:

```bash
pnpm oxfmt
git add -A
git commit -m "chore: format with oxfmt"
```

Then, add the commit hash to a `.git-blame-ignore-revs` file at the root of the repository, so `git blame` and GitHub skip it:

```text .git-blame-ignore-revs
# Format with oxfmt
<commit-sha>
```

## Fix the remaining issues

Run `pnpm oxlint` and fix the reported issues. A few things to expect:

- oxlint honors the existing `eslint-disable` comments, and understands the `@typescript-eslint/` rule prefix. Directives that don't suppress anything anymore are reported as errors: delete them. This includes directives for rules that don't exist in oxlint (such as `@stylistic/*` rules) and for rules the reference turns off.
- New findings from the `suspicious` and `perf` categories, such as `promise/always-return`. Fix them, or turn off the rules that don't fit your codebase.
- New findings from rules that ESLint didn't have, such as `unicorn/*` and `oxc/*` rules.

## Rule mapping

| `@workleap/eslint-configs` | oxlint & oxfmt |
| --- | --- |
| Core (`@eslint/js` recommended and extra rules) | `eslint` plugin, `correctness` category and the rules of the reference configuration |
| `eslint-plugin-import` | `import` plugin |
| `typescript-eslint` `recommendedTypeChecked` and `stylisticTypeCheckedOnly` | `typescript` plugin, with `options.typeAware` and `oxlint-tsgolint` for the type-aware rules |
| `eslint-plugin-react` and `eslint-plugin-react-hooks` | `react` plugin (the hooks rules are `react/rules-of-hooks`, `react/exhaustive-deps`, etc.) |
| `eslint-plugin-jsx-a11y` | `jsx-a11y` plugin |
| `@vitest/eslint-plugin` | `vitest` plugin |
| `eslint-plugin-jest` | `jest` plugin |
| `eslint-plugin-storybook` | JS plugin (`jsPlugins`) |
| `eslint-plugin-testing-library` | JS plugin (`jsPlugins`) |
| `@stylistic/eslint-plugin` and `eslint-plugin-jsonc` | oxfmt |
| `eslint-plugin-yaml` | oxfmt (formatting only) |
| `eslint-plugin-package-json` | oxfmt `sortPackageJson` (sorting only) |
| `@workleap/strict-css-modules-names` | None |

## Known gaps

Compared with `@workleap/eslint-configs`, oxlint `1.90` doesn't have:

- **`@workleap/strict-css-modules-names`**: there is no equivalent to require CSS Modules files to be named after their component.
- **`eslint-plugin-package-json` validation rules**: oxfmt sorts `package.json` files but doesn't validate them. [Syncpack](../syncpack/setup-turborepo.md) and [knip](https://knip.dev/) cover part of it.
- **PropTypes and class component rules** of `eslint-plugin-react`: `react/prop-types`, `react/default-props-match-prop-types`, `react/forbid-foreign-prop-types`, `react/no-typos`, `react/no-unused-prop-types`, `react/no-unused-state`, `react/no-access-state-in-setstate`, `react/destructuring-assignment` and `react/no-deprecated`. TypeScript covers most of them.
- **Experimental rules**: `typescript/prefer-optional-chain` and `react/require-render-return` exist but are in oxlint's `nursery` category, so the reference leaves them out.
- **Native Storybook and Testing Library rules**: they run as JS plugins, which are in alpha.

The `strict`, `no-octal-escape` and `no-restricted-syntax` (`with` statements) rules don't need a replacement: ES modules are always in strict mode, where octal escapes and `with` statements are syntax errors.

## Try it :rocket:

Run `pnpm oxlint` and `pnpm oxfmt:check`. Both commands should complete without errors. Then, restart VS Code, open a TypeScript file, type invalid code (e.g. `var x = 0`), then save. The code should have been fixed and formatted automatically (e.g. `const x = 0;`).
