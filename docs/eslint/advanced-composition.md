---
order: 70
meta:
    title: Advanced composition - ESLint
toc:
    depth: 2
---

!!!warning
This package is compatible only with ESLint v8. It is not intended for use with ESLint v9 or later.
!!!

# Advanced composition

If the default [by project type configurations](default.md/#available-configurations) doesn't fits your needs, rather than writing your own configuration from scratch, you can **compose a new one** from the underlying configuration pieces of `@workleap/eslint-plugin`.

## Available pieces

| Name | Description |
| ---  | --- |
| :icon-mark-github: [core](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/core.ts) | Basic rules shared by every configuration. |
| :icon-mark-github: [typescript](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/typescript.ts) | Rules for [TypeScript](https://www.typescriptlang.org/) files. |
| :icon-mark-github: [react](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/react.ts) | Rules for [React](https://react.dev/) files. |
| :icon-mark-github: [jsx-a11y](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/jsx-a11y.ts) | Rules for testing accessibility in [React](https://react.dev/) files. |
| :icon-mark-github: [jest](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/jest.ts) | Rules for [Jest](https://jestjs.io/) files. |
| :icon-mark-github: [vitest](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/vitest.ts) | Rules for [Vitest](https://vitest.dev/) files. |
| :icon-mark-github: [testing-library](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/testing-library.ts) | Rules for Jest files using [Testing Library](https://testing-library.com/). |
| :icon-mark-github: [storybook](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/storybook.ts) | Rules for [Storybook](https://storybook.js.org/) story files. |
| :icon-mark-github: [mdx](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/mdx.ts) | Rules for [MDX](https://mdxjs.com/) files (used for Storybook MDX stories). |
| :icon-mark-github: [package-json](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/package-json.ts) | Rules for [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) files. |
| :icon-mark-github: [yaml](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-plugin/lib/config/yaml.ts) | Rules for [YAML](https://yaml.org/) files. |

## Compose a configuration

Each configuration piece can be extended individually, or in combination with other pieces, to compose your own custom [ESLint](https://eslint.org/) configuration.

### Single piece

To extend the configuration with a single piece:

```json !#4 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/typescript",
    "rules": {
        ...
    }
}
```

### Multiple pieces

To extend the configuration with multiple pieces:

```json !#4 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": ["plugin:@workleap/core", "plugin:@workleap/typescript"],
    "rules": {
        ...
    }
}
```

## Lint additional files

The configuration pieces already targets which file extensions their linting rules will be applied to. If you wish to lint additional file extensions for a given piece you can add an ESLint [override block](https://eslint.org/docs/latest/use/configure/configuration-files#how-do-overrides-work):

```json !#5-10 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": ["plugin:@workleap/react"],
    "overrides": [
        {
            "files": ["*.js", "*.jsx"],
            "extends": "plugin:@workleap/react"
        }
    ]
}
```





