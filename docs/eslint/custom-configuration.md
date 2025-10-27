---
order: 80
meta:
    title: Custom configuration - ESLint
toc:
    depth: 2-3
---

# Custom configuration

If you are in the process of **migrating an existing project** to use `@workleap/eslint-configs` or encountering a challenging situation that is not currently handled by this library, you might want to customize the default shared configurations.

!!!tip
For a list of the rules included with the default shared configurations, refer to the configuration files in the following [folder](https://github.com/workleap/wl-web-configs/tree/main/packages/eslint-configs/src/by-project-type) on GitHub.
!!!

## Disable a default rule

Each `define` function accepts an object literal as its second argument. This object allows you to configure options for every [rule category](#rules-by-category). You can disable a default rule by redefining it locally and setting its value to `"off"`:

```ts !#4-6 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname, {
    core: {
        "no-var": "off"
    }
});
```

## Change a default rule severity

Each `define` function accepts an object literal as its second argument. This object allows you to configure options for every [rule category](#rules-by-category). You can update the severity of a rule by defining the rule locally with either the `"warn"` or `"error"` severity:

```ts !#4-6 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname, {
    jsxAlly: {
        "jsx-a11y/alt-text": "error"
    }
});
```

## Change a default rule value

Each `define` function accepts an object literal as its second argument. This object allows you to configure options for every [rule category](#rules-by-category). You can update a default rule value by defining the rule locally with its new value:

```ts !#4-6 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname, {
    typescript: {
        "@stylistic/quote-props": "off"
    }
});
```

## Add a plugin

You can configure additional rules from a third-party [ESLint plugin](https://eslint.org/docs/latest/use/configure/plugins) using the plugin's extends option, if the plugin supports it:

```ts !#6-13 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";
import { defineConfig } from "eslint/config";
import myPlugin from "eslint-plugin-myplugin";

export default defineConfig([
    {
        extends: [
            myPlugin
        ],
        rules: {
            "myPlugin/rule": "warn" 
        }
    },
    defineWebApplicationConfig(import.meta.dirname)
]);
```

Or by registring manually the plugin:

```ts !#6-13 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";
import { defineConfig } from "eslint/config";
import myPlugin from "eslint-plugin-myplugin";

export default defineConfig([
    {
        plugins: {
            myPlugin
        },
        rules: {
            "myPlugin/rule": "warn" 
        }
    },
    defineWebApplicationConfig(import.meta.dirname)
]);
```

## Ignore files and folders

You can [ignore](https://eslint.org/docs/latest/use/configure/ignore) certain files and folders by specifying one or more glob patterns:

```ts !#5-9 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        "packages",
        "samples",
        "docs"
    ]),
    defineWebApplicationConfig(import.meta.dirname)
]);
```

## Rules by category

{.eslint-rules-first-column}
Category | Description
--- | --- | ---
:icon-mark-github: [Core](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/core.ts) | Core rules shared across all configurations. Includes most of the ESLint [recommended rules](https://eslint.org/docs/latest/rules/), along with the [rules](https://github.com/import-js/eslint-plugin-import?tab=readme-ov-file#rules) from `eslint-plugin-import`.
:icon-mark-github: [Jest](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/jest.ts) | Includes most of the [recommended rules](https://github.com/testing-library/eslint-plugin-jest-dom?tab=readme-ov-file#supported-rules) from `eslint-plugin-jest`.
:icon-mark-github: [JSON](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/json.ts) | Includes the [rules](https://github.com/ota-meshi/eslint-plugin-jsonc?tab=readme-ov-file#jsonc-rules) from `eslint-plugin-jsonc`.
:icon-mark-github: [JSX A11y](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/jsxAlly.ts) | Includes most of the [recommended rules](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y?tab=readme-ov-file#supported-rules) from `eslint-plugin-jsx-a11y`.
:icon-mark-github: [Package JSON](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/packageJson.ts) | Includes most of the [recommended rules](https://github.com/JoshuaKGoldberg/eslint-plugin-package-json?tab=readme-ov-file#supported-rules) from `eslint-plugin-package-json`.
:icon-mark-github: [React](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/react.ts) | Includes most of the React [recommended rules](https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#list-of-supported-rules) from `eslint-plugin-react`, most of the React Hooks [recommended rules](https://react.dev/reference/eslint-plugin-react-hooks) from `eslint-plugin-react-hooks` and most of the JSX [recommended rules](https://eslint.style/rules?filter=jsx) from `@stylistic/eslint-plugin`.
:icon-mark-github: [Storybook](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/storybook.ts) | Includes most of the [recommended rules](https://github.com/storybookjs/eslint-plugin-storybook?tab=readme-ov-file#supported-rules-and-configurations) from `eslint-plugin-storybook`.
:icon-mark-github: [Testing library](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/core.ts) | Includes the [React rules](https://github.com/testing-library/eslint-plugin-testing-library?tab=readme-ov-file#supported-rules) from `eslint-plugin-testing-library`.
:icon-mark-github: [TypeScript](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/typescript.ts) | Includes most of the [recommended and stylistic rules](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/testingLibrary.ts) from `typescript-eslint`, and most of the [recommended rules](https://eslint.style/rules) from `@stylistic/eslint-plugin`.
:icon-mark-github: [Vitest](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/vitest.ts) | Includes most of the [recommended rules](https://github.com/vitest-dev/eslint-plugin-vitest?tab=readme-ov-file#rules) from `@vitest/eslint-plugin`.
:icon-mark-github: [YAML](https://github.com/workleap/wl-web-configs/blob/main/packages/eslint-configs/src/yaml.ts) | Includes most of the [recommended rules](https://github.com/aminya/eslint-plugin-yaml) from `eslint-plugin-yaml`.
