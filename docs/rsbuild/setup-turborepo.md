---
order: 70
label: Setup with Turborepo
meta:
    title: Setup with Turborepo - Rsbuild
toc:
    depth: 2-3
---

# Setup with Turborepo

To configure [Rsbuild](https://rsbuild.dev/) in a monorepo managed with [Turborepo](https://turborepo.com/), follow these steps 👇

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution's workspace (the root of the repository) and install the following packages:

```bash
pnpm add -D turbo
```

### Configure Turborepo

First, create a configuration file named `turbo.json` at the root of the solution's workspace:

``` !#18
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── apps
├──── app-1
├────── src
├──────── ...
├────── package.json
├──── storybook
├────── .storybook
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
```

Then, open the newly created file and copy/paste the following content:

```json !#5-13 turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
    "tasks": {
        "dev": {
            "dependsOn": ["^build"],
            "cache": false,
            "persistent": true
        },
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", "storybook-static/**"]
        }
    }
}
```

!!!tip
Notice the `^` at the beginning of `^build` ? In Turborepo, the caret (`^`) indicates that a task depends on the same task in its upstream dependencies. For example, `^build` means _"run the build task of all dependencies before running the current package's build task"_. 

This ensures that tasks are executed in the correct order, with dependencies built before their dependents, optimizing task execution order in a monorepo.

For additional information, refer to the [Turborepo documentation](https://turborepo.com/docs).
!!!

### Add CLI scripts

Finally, add the `dev` and `build` scripts to your solution's workspace `package.json` file.

``` !#17
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── apps
├──── app-1
├────── src
├──────── ...
├────── package.json
├──── storybook
├────── .storybook
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── turbo.json
```

The `dev` script will execute the `dev` task configured earlier in the `turbo.json` file:

```json package.json
{
    "dev-app-1": "turbo run dev --filter=./apps/app-1",
    "dev-storybook": "turbo run dev --filter=./apps/storybook"
}
```

The `build` script will execute the `build` task configured earlier in the `turbo.json` file:

```json package.json
{
    "build-app-1": "turbo run build --filter=./apps/app-1",
    "build-storybook": "turbo run build --filter=./apps/storybook"
}
```

!!!tip
The --filter option is used to control which projects tasks are executed. In the previous examples, project paths are used, but you can also filter by package name.
!!!

## Setup projects

### Configure for development

To configure a project with Rsbuild for development, follow the [Configuration for development](./configure-dev.md) guide. Ensure that the project's CLI script is named `dev`.

### Configure for build

To configure a project with Rsbuild for build, follow the [Configuration for build](./configure-build.md) guide. Ensure that the project's CLI script is named `build`.

### Configure for Storybook

To configure a project with Rsbuild for Storybook, follow the [Configuration for Storybook](./configure-storybook.md) guide. Ensure that the project's CLI scripts are named `dev` and `build`.

## Try it :rocket:

To test the new Rsbuild configurations, open a terminal at root of the solution's workspace and execute the [CLI scripts added earlier](#add-cli-scripts): 

- For development scripts, the application development server should start without outputting any terminal errors.
- For build scripts, the application's bundled outputs should be available in either the `dist` or `/storybook-static` folder.

