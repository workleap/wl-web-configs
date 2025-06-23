---
order: 90
label: Workspace script setup
meta:
    title: Setup a monorepo with a workspace script - TypeScript
toc:
    depth: 2-3
---

# Setup a monorepo with a workspace script

To lint a monorepo solution (**multiple projects** per repository), [TypeScript](https://www.typescriptlang.org/) must be set up to lint the files at the root of the solution (the monorepo **workspace**) and the files of every project of the monorepo. Execute the following steps to set up TypeScript for a monorepo solution using a single workspace script :point_down:

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution workspace (the **root** of the repository) and install the following packages:

```bash
pnpm add -D @workleap/typescript-configs typescript
```

### Configure TypeScript

First, create a configuration file named `tsconfig.json` at the root of the solution workspace:

``` !#8
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json
├── tsconfig.json
```

Then, open the newly created file and extend the default configuration with the `monorepo-workspace` shared configurations:

```json !#2 tsconfig.json
{
    "extends": "@workleap/typescript-configs/monorepo-workspace.json",
    "exclude": ["packages", "node_modules"]
}
```

If your application is using [Storybook](https://storybook.js.org/), make sure to include the `.storybook` folder and exclude the `.storybook/storybook-static` folder:

```json !#3 tsconfig.json
{
    "extends": "@workleap/typescript-configs/monorepo-workspace.json",
    "include": ["**/*", ".storybook/*"],
    "exclude": ["packages", "node_modules", ".storybook/storybook-static"]
}
```

### Add a CLI script

At times, especially when running the CI build, it's useful to lint the entire solution using a single command. To do so, add the following script to your solution's workspace `package.json` file:

``` !#7
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── tsconfig.json
```

```json package.json
{
    "lint:types": "pnpm -r --parallel --include-workspace-root exec tsc"
}
```

## Setup a project

### Install the package

Open a terminal at the root of the project (`packages/app` for this example) and install the following package:

```bash
pnpm add -D @workleap/typescript-configs typescript
```

### Configure TypeScript

First, create a configuration file named `tsconfig.json` at the root of the project:

``` !#7
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├────── tsconfig.json
├── package.json
├── tsconfig.json
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](../default.md/#available-configurations) provided by `@workleap/typescript-configs` :point_down:

#### `web-application`

For an applications developed with React, use the following configuration:

```json !#2 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/web-application.json"],
    "exclude": ["dist", "node_modules"]
}
```

#### `library`

For a library project developed with or without React, use the following configuration:

```json !#2 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/library.json"],
    "exclude": ["dist", "node_modules"]
}
```

## Custom configuration

New projects shouldn't have to customize most of the default configurations offered by `@workleap/typescript-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](../custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

### Compiler paths

If your solution is not set up with [JIT packages](https://www.shew.dev/monorepos/packaging/jit) and any projects referencing other projects of the monorepo workspace (e.g. `"@sample/components": "workspace:*"`), chances are that you'll need to define [paths](https://www.typescriptlang.org/tsconfig#compilerOptions) in their `tsconfig.json` file.

Given the following solution:

``` !#3,8,13
workspace
├── packages
├──── app
├────── src
├──────── ...
├────── package.json
├────── tsconfig.json
├──── components (@sample/components)
├────── src
├──────── index.ts
├────── package.json
├────── tsconfig.json
├──── utils (@sample/utils)
├────── src
├──────── index.ts
├────── package.json
├────── tsconfig.json
├── package.json
├── tsconfig.json
```

If the `packages/components` project is referencing the `packages/utils` project, and the `packages/app` project is referencing the `packages/components` project, you'll need to add the following `compilerOptions.paths`:

```json !#4-7 packages/app/tsconfig.json
{
    "extends": "@workleap/typescript-configs/web-application.json",
    "compilerOptions": {
        "paths": {
            "@sample/components": ["../components/index.ts"],
            "@sample/utils": ["../utils/index.ts"]
        }
    },
    "exclude": ["dist", "node_modules"]
}
```

```json !#4-6 packages/components/tsconfig.json
{
    "extends": "@workleap/typescript-configs/library.json",
    "compilerOptions": {
        "paths": {
            "@sample/utils": ["../utils/index.ts"]
        }
    },
    "exclude": ["dist", "node_modules"]
}
```

## Try it :rocket:

To test your new TypeScript setup, open a TypeScript file, type invalid code (e.g. `import { App } from "./App"`), then wait for the IDE to flag the error. Fix the error (e.g. `import { App } from "./App.tsx"`), then wait for the IDE to remove the error.

Alternatively, to catch the error, open a terminal at the root of the solution and execute the CLI script added earlier:

```bash
pnpm lint:types
```

The terminal should output a linting error.
