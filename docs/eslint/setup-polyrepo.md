---
order: 100
label: Setup a polyrepo
meta:
    title: Configure a polyrepo - ESLint
toc:
    depth: 2
---

!!!warning
This package is compatible only with ESLint v8. It is not intended for use with ESLint v9 or later.
!!!

# Setup a polyrepo

Execute the following steps to setup [ESLint](https://eslint.org/) for a polyrepo solution (**single project** per repository) :point_down:

## Install the packages

Open a terminal at the root of the solution and install the following packages:

```bash
pnpm add -D @workleap/eslint-plugin eslint @typescript-eslint/parser
```

## Configure ESLint

First, create a configuration file named `.eslintrc.json` at the root of the solution:

``` !#5
root
├── src
├──── ...
├── package.json
├── .eslintrc.json
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](default.md#available-configurations) provided by `@workleap/eslint-plugin` :point_down:

### `web-application`

For an application developed with TypeScript and React, use the following configuration:

```json !#4 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/web-application"
}
```

### `react-library`

For a TypeScript library developed **with** React, use the following configuration:

```json !#4 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/react-library"
}
```

### `typescript-library`

For a TypeScript library developed **without** React, use the following configuration:

```json !#4 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/typescript-library"
}
```

### .eslintignore

ESLint can be configured to [ignore](https://eslint.org/docs/latest/use/configure/ignore) certain files and directories while linting by specifying one or more glob patterns.

To do so, first, create an `.eslintignore` file at the root of the solution:

``` !#6
root
├── src
├──── ...
├── package.json
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

## Configure the indent style

[ESLint](https://eslint.org/) offers [built-in rules](https://eslint.org/docs/latest/rules/indent) for configuring the indentation style of a codebase. However, there's a catch: when [VS Code auto-formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) feature is enabled, it might conflict with the configured indentation rules if they are set differently.

To guarantee a consistent indentation, we recommend using [EditorConfig](https://editorconfig.org/) on the consumer side. With EditorConfig, the indent style can be configured in a single file and be applied consistently across various formatting tools, including ESlint and [VS Code](https://code.visualstudio.com/).

First, create a `.editorconfig` file at the root of the solution:

``` !#7
root
├── src
├──── ...
├── package.json
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

Finally, install the [EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) VS Code extension.

## Add a CLI script

At times, especially when running the CI build, it's useful to lint the entire solution using a single command. To do so, add the following script to your solution's `package.json` file:

```json package.json
{
    "lint:eslint": "eslint . --max-warnings=0 --cache --cache-location node_modules/.cache/eslint"
}
```

> The script definition may vary depending of your needs and your application configuration. For example, you might want to specify specific file extensions such as `--ext .js,.ts,.tsx`.

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/eslint-plugin`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new ESLint setup, open a JavaScript file, type invalid code (e.g. `var x = 0;`), then save. Open a terminal at the root of the solution and execute the [CLI script added earlier](#add-a-cli-script):

```bash
pnpm lint:eslint
```

The terminal should output a linting error.
