---
order: 100
meta:
    title: Setup with Turborepo - TypeScript
toc:
    depth: 2-3
---

# Setup with Turborepo

Execute the following steps to set up [TypeScript](https://www.typescriptlang.org/) for a monorepo solution managed with [Turborepo](https://turborepo.com/) :point_down:

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution's workspace (the **root** of the repository) and install the following packages:

```bash
pnpm add -D @workleap/typescript-configs typescript turbo
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
├── tsconfig.json
```

Then, open the newly created file and copy/paste the following content:

```json !#5-13 turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
    "tasks": {
        "lint": {
            "dependsOn": ["typecheck"]
        },
        "//#typecheck": {
            "outputs": ["node_modules/.cache/tsbuildinfo.json"]
        },
        "typecheck": {
            "outputs": ["node_modules/.cache/tsbuildinfo.json"]
        }
    }
}
```

The `//#typecheck` task will execute the `typecheck` script at the root of the solution's workspace and the `typecheck` task will execute the `typecheck` script for every project of the solution's workspace.

!!!tip
For additional information, refer to the [Turborepo documentation](https://turborepo.com/docs).
!!!

### Configure TypeScript

Next, let's configure TypeScript. Create a configuration file named `tsconfig.json` at the root of the solution's workspace:

``` !#9
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
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

### Add CLI scripts

Finally, add the `lint` and `typecheck` scripts to your solution's workspace `package.json` file.

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── turbo.json
├── tsconfig.json
```

The `lint` script will execute the `lint` task and it's dependencies configured earlier in the `turbo.json` file:

```json package.json
{
    "lint": "turbo run lint --continue"
}
```

The `typecheck` script will lint the root of the solution's workspace:

```json package.json
{
    "typecheck": "tsgo"
}
```

!!!tip
While the `lint` task may seem redundant for now, it's important to note that as your Turborepo configuration evolves, additional linting tasks will be added as dependencies of the main `lint` task.
!!!

## Setup a project

### Install the packages

Open a terminal at the root of the project (`packages/pkg-1` for this example) and install the following packages:

```bash
pnpm add -D @workleap/typescript-configs typescript
```

### Configure TypeScript

First, create a configuration file named `tsconfig.json` at the root of the project:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── tsconfig.json
├── package.json
├── tsconfig.json
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](./getting-started.md#available-configurations) provided by `@workleap/typescript-configs` :point_down:

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

### Add a CLI script

Finally, add the following `typecheck` script to your project `package.json` file. This script will be executed by Turborepo:

```json packages/pkg-1/package.json
{
    "typecheck": "tsgo"
}
```

## Custom configuration

New projects shouldn't have to customize most of the default configurations offered by `@workleap/typescript-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](./custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

### Compiler paths

If your solution is not set up with [JIT packages](https://www.shew.dev/monorepos/packaging/jit) and any projects are referencing other projects of the monorepo workspace (e.g. `"@sample/components": "workspace:*"`), chances are that you'll need to define [paths](https://www.typescriptlang.org/tsconfig#compilerOptions) in their `tsconfig.json` file.

Given the following solution:

``` !#3,8,13
workspace
├── packages
├──── pkg-1
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
├── turbo.json
├── tsconfig.json
```

If the `packages/components` project is referencing the `packages/utils` project, and the `packages/pkg-1` project is referencing the `packages/components` project, you'll need to add the following `compilerOptions.paths`:

```json !#4-7 packages/pkg-1/tsconfig.json
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
pnpm lint
```

The terminal should output a linting error.
