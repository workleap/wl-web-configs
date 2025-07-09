---
order: 100
label: Setup a polyrepo
meta:
    title: Setup a polyrepo - TypeScript
toc:
    depth: 2
---

# Setup a polyrepo

Execute the following steps to setup [TypeScript](https://www.typescriptlang.org/) for a polyrepo solution (**single project** per repository) :point_down:

## Install the packages

Open a terminal at the root of the solution and install the following packages:

```bash
pnpm add -D @workleap/typescript-configs typescript
```

## Configure TypeScript

First, create a configuration file named `tsconfig.json` at the root of the solution:

``` !#5
root
├── src
├──── ...
├── package.json
├── tsconfig.json
```

Then, open the newly created file and extend the default configuration with one of the [shared configurations](./getting-started.md#available-configurations) provided by `@workleap/typescript-configs` :point_down:

### `web-application`

For an applications developed with React, use the following configuration:

```json !#2 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/web-application.json"],
    "exclude": ["dist", "node_modules"]
}
```

If your application is using [Storybook](https://storybook.js.org/), make sure to include the `.storybook` folder:

```json !#3 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/web-application.json"],
    "include": ["**/*", ".storybook/*"],
    "exclude": ["dist", "node_modules"]
}
```

### `library`

For a library project developed with or without React, use the following configuration:

```json !#2 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/library.json"],
    "exclude": ["dist", "node_modules"]
}
```

If your application is using [Storybook](https://storybook.js.org/), make sure to include the `.storybook` folder and exclude the `.storybook/storybook-static` folder:

```json !#3-4 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/library.json"],
    "include": ["**/*", ".storybook/*"],
    "exclude": ["dist", "node_modules", ".storybook/storybook-static"]
}
```

## Add a CLI script

At times, especially when running the CI build, it's useful to lint the entire solution using a single command. To do so, add the following script to your solution's `package.json` file:

```json package.json
{
    "lint:types": "tsc"
}
```

## Custom configuration

New projects shouldn't have to customize the default configurations offered by `@workleap/typescript-configs`. However, if you are in the process of **migrating** an existing project to use this library or encountering a challenging situation, refer to the [custom configuration](custom-configuration.md) page to understand how to override or extend the default configurations. Remember, **no locked in** :heart::v:.

## Try it :rocket:

To test your new TypeScript setup, open a TypeScript file, type invalid code (e.g. `import { App } from "./App"`), then wait for the IDE to flag the error. Fix the error (e.g. `import { App } from "./App.tsx"`), then wait for the IDE to remove the error.
