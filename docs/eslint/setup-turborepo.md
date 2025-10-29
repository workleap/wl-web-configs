---
order: 90
meta:
    title: Setup with Turborepo - ESLint
---

# Setup with Turborepo

Execute the following steps to set up [ESLint](https://eslint.org/) for a monorepo solution managed with [Turborepo](https://turborepo.com/) :point_down:

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution's workspace (the **root** of the repository) and install the following packages:

```bash
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint turbo
```

### Configure Turborepo

First, create a configuration file named `turbo.json` at the root of the solution's workspace:

``` !#8
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── eslint.config.ts
```

Then, open the newly created file and copy/paste the following content:

```json !#5-13 turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
    "tasks": {
        "lint": {
            "dependsOn": ["eslint"]
        },
        "//#eslint": {
            "outputs": ["node_modules/.cache/eslint"]
        },
        "eslint": {
            "outputs": ["node_modules/.cache/eslint"]
        }
    }
}
```

The `//#eslint` task will execute the `eslint` script at the root of the solution's workspace and the `eslint` task will execute the `eslint` script for every project of the solution's workspace.

!!!tip
For additional information, refer to the [Turborepo documentation](https://turborepo.com/docs).
!!!

### Configure ESLint

Next, let's configure ESLint. Create a configuration file named `eslint.config.ts` at the root of the solution's workspace:

``` !#9
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── eslint.config.ts
```

Then, open the newly created file and extend the default configuration with the monorepo workspace shared configurations:

```ts !#3 eslint.config.ts
import { defineMonorepoWorkspaceConfig } from "@workleap/eslint-configs";

export default defineMonorepoWorkspaceConfig(import.meta.dirname);
```

#### Ignore files and folders

ESLint can be configured to [ignore](https://eslint.org/docs/latest/use/configure/ignore) certain files and folders by specifying one or more glob patterns.

To do so, extend the `eslint.config.ts` file configuration at the root of the solution:

```ts !#5-9 eslint.config.ts
import { defineMonorepoWorkspaceConfig } from "@workleap/eslint-configs";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        "packages",
        "samples",
        "docs"
    ]),
    defineMonorepoWorkspaceConfig(import.meta.dirname)
]);
```

!!!tip
The configuration ignores common folders by default, such as `node_modules`, `dist`, `storybook-static`, `.git`, `.turbo` etc. Before manually adding more ignored files or folders, make sure that ESLint is actually processing them.
!!!

### Configure indent style

[@stylistic/eslint-plugin](https://eslint.style/) offers built-in rules for configuring the indentation style of a codebase. However, there's a catch: when [VS Code auto-formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) feature is enabled, it might conflict with the configured indentation rules if they are set differently.

To guarantee a consistent indentation, we recommend using [EditorConfig](https://editorconfig.org/) on the consumer side. With EditorConfig, the indent style can be configured in a single file and be applied consistently across various formatting tools, including ESlint and [VS Code](https://code.visualstudio.com/).

First, create a `.editorconfig` file at the root of the solution's workspace:

``` !#10
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── eslint.config.ts
├── .editorconfig
```

Then, open the newly created file and paste the following configuration:

```bash .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

### Add CLI scripts

Finally, add the `lint` and `eslint` scripts to your solution's workspace `package.json` file.

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── turbo.json
├── eslint.config.ts
├── .editorconfig
```

The `lint` script will execute the `lint` task and it's dependencies configured earlier in the `turbo.json` file:

```json package.json
{
    "lint": "turbo run lint --continue"
}
```

The `eslint` script will lint the root of the solution's workspace:

```json package.json
{
    "eslint": "eslint . --max-warnings=0 --cache --cache-location node_modules/.cache/eslint"
}
```

!!!tip
While the `lint` task may seem redundant for now, it's important to note that as your Turborepo configuration evolves, additional linting tasks will be added as dependencies of the main `lint` task.
!!!

## Setup a project

### Install the packages

Open a terminal at the root of the project (`packages/pkg-1` for this example) and install the following packages:

```bash
pnpm add -D @workleap/eslint-configs @eslint/js @typescript-eslint/parser @types/node eslint typescript-eslint
```

### Configure ESLint

First, create a configuration file named `eslint.config.ts` at the root of the project:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── eslint.config.ts
├── package.json
├── eslint.config.ts
├── .editorconfig
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](./getting-started.md#available-configurations) provided by `@workleap/eslint-plugin` :point_down:

#### Web application

For an application developed with TypeScript and React, use the following configuration:

```ts !#3 eslint.config.ts
import { defineWebApplicationConfig } from "@workleap/eslint-configs";

export default defineWebApplicationConfig(import.meta.dirname);
```

#### React library

For a TypeScript library developed **with** React, use the following configuration:

```ts !#3 eslint.config.ts
import { defineReactLibraryConfig } from "@workleap/eslint-configs";

export default defineReactLibraryConfig(import.meta.dirname);
```

##### React compiler

If your application is set up with the [React compiler](https://react.dev/learn/react-compiler), enable the React Compiler rules:

```ts !#4-6 eslint.config.ts
import { defineReactLibraryConfig } from "@workleap/eslint-configs";

export default defineReactLibraryConfig(import.meta.dirname, {
    react: {
        compiler: true
    }
});
```

#### TypeScript library

For a TypeScript library developed **without** React, use the following configuration:

```ts !#3 eslint.config.ts
import { defineTypescriptLibraryConfig } from "@workleap/eslint-configs";

export default defineTypescriptLibraryConfig(import.meta.dirname);
```

### Add a CLI script

Finally, add the following `eslint` script to your project `package.json` file. This script will be executed by Turborepo:

```json packages/pkg-1/package.json
{
    "eslint": "eslint . --max-warnings=0 --cache --cache-location node_modules/.cache/eslint"
}
```

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/eslint-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](./custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new ESLint setup, open a JavaScript file, type invalid code (e.g. `var x = 0;`), then save. Open a terminal at the root of the solution and execute the [CLI script added earlier](#add-a-cli-script):

```bash
pnpm lint
```

The terminal should output a linting error.

### Troubleshoot issues

Refer to the [troubleshooting](./troubleshooting.md) page.
