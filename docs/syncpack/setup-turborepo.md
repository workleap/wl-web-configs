---
order: 70
label: Setup with Turborepo
meta:
    title: Setup with Turborepo - Syncpack
toc:
    depth: 2-3
---

# Setup with Turborepo

[Syncpack](https://jamiemason.github.io/syncpack/) is a developer tool designed to keep your `package.json` dependencies in sync **in a monorepo setup**.  It can be used both as a linter to detect version mismatches and as a fixer to automatically resolve them.

To configure Syncpack in a monorepo managed with [Turborepo](https://turborepo.com/), follow these steps 👇

## Install the packages

Open a terminal at the root of the solution's workspace (the root of the repository) and install the following packages:

```bash
pnpm add -D syncpack turbo
```

## Configure Turborepo

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
```

Then, open the newly created file and copy/paste the following content:

```json !#5-8
{
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
    "tasks": {
        "lint": {
            "dependsOn": ["//#syncpack"]
        },
        "//#syncpack": {}
    }
}
```

The `//#syncpack` task will only execute the `syncpack` script at the root of the solution's workspace.

!!!tip
For additional information, refer to the [Turborepo documentation](https://turborepo.com/docs).
!!!

## Configure Syncpack

!!!warning
A Syncpack configuration is highly specific to each project. While the following boilerplate offers a starting point for many use cases, it's important to review and tailor it to fit your project's particular needs.

Look at other project configurations as inspiration:

{.no-bottom-margin}
- [wl-web-configs](https://github.com/workleap/wl-web-configs/blob/main/.syncpackrc.js)
- [wl-squide](https://github.com/workleap/wl-squide/blob/main/.syncpackrc.js)
- [wl-honeycomb-web](https://github.com/workleap/wl-honeycomb-web/blob/main/.syncpackrc.js)
- [workleap-platform-widgets](https://dev.azure.com/workleap/WorkleapPlatform/_git/workleap-platform-widgets?path=/.syncpackrc.js)
!!!

Next, let's configure Syncpack. Create a configuration file named `.syncpackrc.js` at the root of the solution's workspace:

``` !#9
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json
├── turbo.json
├── .syncpackrc.js
```

Then, open the newly created file and copy/paste the following boilerplate configuration:

```js .syncpackrc.js
// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    "lintFormatting": false,
    "semverGroups": [
        {
            "packages": ["@[YOUR_PROJECT_SCOPE]/apps/*"],
            "dependencyTypes": ["prod", "dev"],
            "range": "",
            "label": "Apps should pin dependencies and devDependencies."
        },
        {
            "packages": ["@[YOUR_PROJECT_SCOPE]/packages/*"],
            "dependencyTypes": ["peer"],
            "range": "^",
            "label": "Packages should use ^ for peerDependencies."
        },
        {
            "packages": ["workspace-root"],
            "dependencyTypes": ["dev"],
            "range": "",
            "label": "Workspace root should pin devDependencies."
        }
    ],
    "versionGroups": [
        {
            "packages": ["**"],
            "dependencyTypes": ["prod", "dev", "peer"],
            "preferVersion": "highestSemver",
            "label": "Packages and Apps should have a single version across the repository."
        }
    ]
};
```

Then, replace `[YOUR_PROJECT_SCOPE]` by your project scope.

## Add CLI scripts

Finally, add the `lint` and `syncpack` scripts to your solution's workspace `package.json` file.

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├── package.json    <------- (this one!)
├── turbo.json
├── .syncpackrc.js
```

The `lint` script will execute the `lint` task and its dependencies configured earlier in the `turbo.json` file:

```json package.json
{
    "lint": "turbo run lint --continue"
}
```

The `//#syncpack` script will lint the root of the solution's workspace:

```json package.json
{
    "syncpack": "syncpack lint"
}
```

!!!tip
While the `lint` task may seem redundant for now, it's important to note that as your Turborepo configuration evolves, additional linting tasks will be added as dependencies of the main `lint` task.
!!!

## Try it :rocket:

To test your new Syncpack setup:

1. Identify a dependency that is installed in multiple projects within the monorepo.

2. Open a terminal at the root of the workspace and run the CLI script added earlier. Syncpack should complete without reporting any errors:

```bash
pnpm lint
```

3. In one of the projects, bump the version of that dependency, and run the script again:

```bash
pnpm lint
```

4. Syncpack should report a version mismatch error in the terminal.


