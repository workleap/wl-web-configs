---
order: 90
meta:
    title: Setup with Turborepo - ESLint
toc:
    depth: 2-3
---

!!!warning
This package is compatible only with ESLint v8. It is not intended for use with ESLint v9 or later.
!!!

# Setup with Turborepo

Execute the following steps to set up [ESLint](https://eslint.org/) for a monorepo solution managed with [Turborepo](https://turborepo.com/) :point_down:

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution's workspace (the **root** of the repository) and install the following packages:

```bash
pnpm add -D @workleap/eslint-plugin eslint typescript @typescript-eslint/parser turbo
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
├── .eslintrc.json
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

Next, let's configure ESLint. Create a configuration file named `.eslintrc.json` at the root of the solution's workspace:

``` !#9
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .eslintrc.json
```

Then, open the newly created file and extend the default configuration with the `monorepo-workspace` shared configurations:

```json !#4 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/monorepo-workspace"
}
```

#### .eslintignore

ESLint can be configured to [ignore](https://eslint.org/docs/latest/use/configure/ignore) certain files and directories while linting by specifying one or more glob patterns.

To do so, first, create a `.eslintignore` file at the root of the solution's workspace:

``` !#10
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .eslintrc.json
├── .eslintignore
```

Then, open the newly created file and paste the following ignore rules:

```bash .eslintignore
**/dist/*
node_modules
__snapshots__
storybook-static
pnpm-lock.yaml
package-lock.json
*.md
!.storybook
```

!!!info
While only the `.storybook` dot folder is listed, you should include any other dot folders that need to be linted.
!!!

### Configure indent style

ESLint offers [built-in rules](https://eslint.org/docs/latest/rules/indent) for configuring the indentation style of a codebase. However, there's a catch: when [VS Code auto-formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) feature is enabled, it might conflict with the configured indentation rules if they are set differently.

To guarantee a consistent indentation, we recommend using [EditorConfig](https://editorconfig.org/) on the consumer side. With EditorConfig, the indent style can be configured in a single file and be applied consistently across various formatting tools, including ESlint and [VS Code](https://code.visualstudio.com/).

First, create a `.editorconfig` file at the root of the solution's workspace:

``` !#11
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .eslintrc.json
├── .eslintignore
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
├── .eslintrc.json
├── .eslintignore
├── .editorconfig
```

The `lint` script will execute the tasks configured earlier in the `turbo.json` file:

```json package.json
{
    "lint": "turbo run lint --continue"
}
```

The `eslint` script will lint the root of the solution's workspace:

```json package.json
{
    "eslint": "eslint . --ignore-pattern packages --max-warnings=-0 --cache --cache-location node_modules/.cache/eslint"
}
```

!!!tip
To prevent the root `eslint` script from linting the `packages` folder, add the `--ignore-pattern packages` option to the script. Apply the same pattern to every folder that includes nested `eslint` scripts.
!!!

## Setup a project

### Install the packages

Open a terminal at the root of the project (`packages/pkg-1` for this example) and install the following packages:

```bash
pnpm add -D @workleap/eslint-plugin
```

### Configure ESLint

First, create a configuration file named `.eslintrc.json` at the root of the project:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── .eslintrc.json
├── package.json
├── .eslintrc.json
├── .eslintignore
├── .editorconfig
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](/eslint/#available-configurations) provided by `@workleap/eslint-plugin` :point_down:

#### `web-application`

For an application developed with TypeScript and React, use the following configuration:

```json !#4 packages/pkg-1/.eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/web-application"
}
```

#### `react-library`

For a TypeScript library developed **with** React, use the following configuration:

```json !#4 packages/pkg-1/.eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/react-library"
}
```

#### `typescript-library`

For a TypeScript library developed **without** React, use the following configuration:

```json !#4 packages/pkg-1/.eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/typescript-library"
}
```

### Add a CLI script

Finally, add the following `eslint` script to your project `package.json` file. This script will be executed by Turborepo:

```json packages/pkg-1/package.json
{
    "eslint": "eslint . --max-warnings=-0 --cache --cache-location node_modules/.cache/eslint"
}
```

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/eslint-plugin`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](./custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new ESLint setup, open a JavaScript file, type invalid code (e.g. `var x = 0;`), then save. Open a terminal at the root of the solution and execute the [CLI script added earlier](#add-a-cli-script):

```bash
pnpm lint
```

The terminal should output a linting error.
