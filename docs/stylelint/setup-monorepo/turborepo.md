---
order: 100
label: Turborepo setup
meta:
    title: Setup a monorepo with Turborepo - Stylelint
toc:
    depth: 2-3
---

# Setup a monorepo with Turborepo

To lint a monorepo solution (**multiple projects** per repository), [Stylelint](https://stylelint.io/) must be set up to lint the files at the root of the solution (the monorepo **workspace**) and the files of every project of the monorepo. Execute the following steps to set up Stylelint for a monorepo solution managed with [Turborepo](https://turborepo.com/) :point_down:

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution's workspace (the **root** of the repository) and install the following packages:

```bash
pnpm add -D @workleap/stylelint-configs stylelint prettier turbo
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

```json !#5-10 turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
    "tasks": {
        "lint": {
            "dependsOn": ["stylelint"]
        },
        "stylelint": {
            "outputs": ["node_modules/.cache/stylelint"]
        }
    }
}
```

The `stylelint` task will execute the `stylelint` script for every project of the solution's workspace.

!!!tip
For additional information, refer to the [Turborepo documentation](https://turborepo.com/docs).
!!!

### Configure Stylelint

Next, let's configure Stylelint. Create a configuration file named `.stylelintrc.json` at the root of the solution's workspace:

``` !#9
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .stylelintrc.json
```

Then, open the newly created file and extend the default configuration with the shared configurations provided by `@workleap/stylelint-configs`:

```json .stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "extends": "@workleap/stylelint-configs"
}
```

#### .stylelintignore

Stylelint can be configured to [ignore](https://stylelint.io/user-guide/ignore-code#files-entirely) certain files and directories while linting by specifying one or more glob patterns.

To do so, first, create an `.stylelintignore` file at the root of the solution's workspace:

``` !#10
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .stylelintrc.json
├── .stylelintignore
```

Then, open the newly created file and paste the following ignore rules:

```bash .stylelintignore
**/dist/*
node_modules
storybook-static
!.storybook
```

#### .prettierignore

Since we choose to [stick with ESLint for JavaScript and JSON stylistic rules](../../eslint/default.md#prettier), a `.prettierignore` file must be added at the root of the solution's workspace to ignore everything but CSS files.

To do so, first, create a `.prettierignore` file at the root of the solution's workspace:

``` !#11
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .stylelintrc.json
├── .stylelintignore
├── .prettierignore
```

Then, open the newly created file and paste the following ignore rules:

``` .prettierignore
*
!**/*.css
```

### Configure the indent style

Prettier offers [built-in rules](https://prettier.io/docs/en/options#tab-width) for configuring the indentation style of a codebase. However, there's a catch: when [VS Code auto-formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) feature is enabled, it might conflict with the configured indentation rules if they are set differently.

To guarantee a consistent indentation, we recommend using [EditorConfig](https://editorconfig.org/) on the consumer side. With EditorConfig, the indent style can be configured in a single file and be applied consistently across various formatting tools, including ESlint and VS Code.

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
├── .stylelintrc.json
├── .stylelintignore
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

### Add a CLI script

Finally, add the following script to your solution's workspace `package.json` file:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── turbo.json
├── .stylelintrc.json
├── .stylelintignore
├── .editorconfig
```

```json package.json
{
    "lint": "turbo run lint --continue"
}
```

## Setup a project

### Install the packages

Open a terminal at the root of the project (`packages/pkg-1` for this example) and install the following package:

```bash
pnpm add -D @workleap/stylelint-configs
```

### Configure Stylelint

First, create a configuration file named `.stylelintrc.json` at the root of the project:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── .stylelintrc.json
├── package.json
├── .stylelintrc.json
├── .stylelintignore
├── .editorconfig
```

Then, open the newly created file and extend the default configuration with the shared configurations provided by `@workleap/stylelint-configs`:

```json packages/pkg-1/.stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "extends": "@workleap/stylelint-configs"
}
```

### Add a CLI script

Finally, add the following `eslint` script to your project `package.json` file. This script will be executed by Turborepo:

```json packages/pkg-1/package.json
{
    "stylelint": "stylelint \"**/*.css\" --allow-empty-input --cache --cache-location node_modules/.cache/stylelint --max-warnings=0"
}
```

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/stylelint-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](../custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new setup, open a CSS file, type invalid code (e.g. `color: #fff`), then save. Open a terminal at the root of the solution and execute the CLI script added earlier:

```bash
pnpm lint
```

The terminal should output a linting error.
