---
order: 90
label: Workspace script setup
meta:
    title: Setup a monorepo workspace script - Stylelint
toc:
    depth: 2-3
---

# Setup a monorepo with a workspace script

To lint a monorepo solution (**multiple projects** per repository), [Stylelint](https://stylelint.io/) must be setuped to lint the files at the root of the solution (the monorepo **workspace**) and the files of every project of the monorepo. Execute the following steps to setup Stylelint for a monorepo solution using a single workspace script :point_down:

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution workspace (the **root** of the repository) and install the following packages:

```bash
pnpm add -D @workleap/stylelint-configs stylelint prettier
```

### Configure Stylelint

First, create a configuration file named `.stylelintrc.json` at the root of the solution workspace:

``` !#8
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json
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

To do so, first, create an `.stylelintignore` file at the root of the solution workspace:

``` !#9
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json
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

Since we choose to [stick with ESLint for JavaScript and JSON stylistic rules](../../eslint/default.md#prettier), a `.prettierignore` file must be added at the root of the solution workspace to ignore everything but CSS files.

To do so, first, create a `.prettierignore` file at the root of the solution workspace:

``` !#10
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json
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

First, create a `.editorconfig` file at the root of the solution workspace:

``` !#10
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json
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
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── .stylelintrc.json
├── .stylelintignore
├── .editorconfig
```

```json package.json
{
    "lint:stylelint:": "stylelint \"**/*.css\" --cache --cache-location node_modules/.cache/stylelint"
}
```

> The script definition may vary depending on your needs and your application configuration. For example, you might want to specify additional file extensions such as `"**/*.{css,scss,sass}"`.

## Setup a project

### Install the packages

Open a terminal at the root of the project (`packages/app` for this example) and install the following package:

```bash
pnpm add -D @workleap/stylelint-configs
```

### Configure Stylelint

First, create a configuration file named `.stylelintrc.json` at the root of the project:

``` !#7
workspace
├── packages
├──── app
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

```json packages/app/.stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "extends": "@workleap/stylelint-configs"
}
```

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/stylelint-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](../custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new setup, open a CSS file, type invalid code (e.g. `color: #fff`), then save. Open a terminal at the root of the solution and execute the CLI script added earlier:

```bash
pnpm lint:stylelint
```

The terminal should output a linting error.
