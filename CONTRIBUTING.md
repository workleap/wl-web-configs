# Contributing

The following documentation is only for the maintainers of this repository.

- [Monorepo setup](#monorepo-setup)
- [Project overview](#project-overview)
- [Installation](#installation)
- [Release the packages](#release-the-packages)
- [Available commands](#commands)
- [CI](#ci)
- [Add a new package to the monorepo](#add-a-new-package-to-the-monorepo)

## Monorepo setup

This repository is managed as a monorepo with [PNPM workspace](https://pnpm.io/workspaces) to handle the installation of the npm dependencies and manage the packages interdependencies.

It's important to note that PNPM workspace doesn't hoist the npm dependencies at the root of the workspace as most package manager does. Instead, it uses an advanced [symlinked node_modules structure](https://pnpm.io/symlinked-node-modules-structure). This means that you'll find a `node_modules` directory inside the packages folders as well as at the root of the repository.

The main difference to account for is that the `devDependencies` must now be installed locally in every package `package.json` file rather than in the root `package.json` file.

### Turborepo

This repository use [Turborepo](https://turbo.build/repo/docs) to execute it's commands. Turborepo help saving time with it's built-in cache but also ensure the packages topological order is respected when executing commands.

To be understand the relationships between the commands, have a look at this repository [turbo.json](./turbo.json) configuration file.

## Project overview

This project is composed of many packages. Each package is located in the [packages](packages/) directory. These packages represent shared configuration for tools that are used across the Workleap projects.

## Installation

This project uses PNPM workspace, therefore, you must [install PNPM](https://pnpm.io/installation):

To install the project, open a terminal at the root of the workspace and execute the following command:

```bash
pnpm install
```

### Setup Retype

[Retype](https://retype.com/) is the documentation platform that `workleap/web-configs` is using for its documentation. As this project is leveraging a few [Pro features](https://retype.com/pro/) of Retype.

Everything should work fine as-is but there are a few limitations to use Retype Pro features without a wallet with a licence. If you want to circumvent these limitations, you can optionally, setup your [Retype wallet](https://retype.com/guides/cli/#retype-wallet).

To do so, first make sure that you retrieve the Retype license from your Vault (or ask IT).

Then, open a terminal at the root of the workspace and execute the following command:

```bash
npx retype wallet --add <your-license-key-here>
```

## Develop the packages

The packages can be tested with the sample application. Open a [VSCode terminals](https://code.visualstudio.com/docs/terminal/basics#_managing-multiple-terminals) and start the sample application with one of the following scripts:

```bash
pnpm dev-sample
```

or

```bash
pnpm dev-sample-msw
```

## Release the packages

When you are ready to release the packages, you must follow the following steps:
1. Run `pnpm changeset` and follow the prompt. For versioning, always follow the [SemVer standard](https://semver.org/).
2. Commit the newly generated file in your branch and submit a new Pull Request(PR). Changesets will automatically detect the changes and post a message in your pull request telling you that once the PR closes, the versions will be released.
3. Find someone to review your PR.
4. Merge the Pull request into `main`. A GitHub action will automatically trigger and update the version of the packages and publish them to [npm](https://www.npmjs.com/). A tag will also be created on GitHub tagging your PR merge commit.

### Troubleshooting

#### GitHub

Make sure you're Git is clean (No pending changes).

#### npm

Make sure GitHub Action has **write access** to the selected npm packages.

#### Compilation

If the packages failed to compile, it's easier to debug without executing the full release flow every time. To do so, instead, execute the following command:

```bash
pnpm build
```

By default, packages compilation output will be in their respective *dist* directory.

## Commands

From the project root, you have access to many commands the main ones are:

### dev-webpack

Build the sample application using webpack as a bundler for development and start the dev server.

```bash
pnpm dev-webpack
```

### dev-webpack-msw

Build the sample application using webpack as a bundler for development with MSW and start the dev server.

```bash
pnpm dev-webpack-msw
```

### dev-rsbuild

Build the sample application using Rsbuild as a bundler for development and start the dev server.

```bash
pnpm dev-rsbuild
```

### dev-rsbuild-msw

Build the sample application using Rsbuild as a bundler for development with MSW and start the dev server.

```bash
pnpm dev-rsbuild-msw
```

### dev-storybook-rsbuild

Build the sample Storybook application using Rsbuild as a bundler for development and start the dev server.

```bash
pnpm dev-storybook-rsbuild
```

### dev-storybook-rslib

Build the sample Storybook application using Rsbuild as a bundler but with an Rslib config file for development and start the dev server.

```bash
pnpm dev-storybook-rslib
```

### build-pkg

Build the packages for release.

```bash
pnpm build-pkg
```

### build-webpack

Build the sample application using webpack as a bundler for release.

```bash
pnpm build-webpack
```

### build-rsbuild

Build the sample application using Rsbuild as a bundler for release.

```bash
pnpm build-rsbuild
```

### build-storybook-rsbuild

Build the sample Storybook application using Rsbuild as a bundler for release.

```bash
pnpm build-storybook-rsbuild
```

### build-storybook-rslib

Build the sample Storybook application using Rsbuild as a bundler but with an Rslib config file as a bundler for release.

```bash
pnpm build-storybook-rslib
```

### serve-webpack

Build the sample application using webpack and start a local web server to serve the application.

```bash
pnpm serve-webpack
```

### serve-rsbuild

Build the sample application using Rsbuild and start a local web server to serve the application.

```bash
pnpm serve-rsbuild
```

### serve-storybook-rsbuild

Build the sample Storybook application using Rsbuild and start a local web server to serve the application.

```bash
pnpm serve-storybook-rsbuild
```

### serve-storybook-rslib

Build the sample Storybook application using Rsbuild as a bundler but with an Rslib config file and start a local web server to serve the application.

```bash
pnpm serve-storybook-rsbuild
```

### deploy-rsbuild

Build the sample application using Rsbuild and deploy the output to a [Netlify site](https://web-configs-rsbuild-sample.netlify.app).

```bash
pnpm deploy-rsbuild
```

### dev-docs

Build the [Retype](https://retype.com/) documentation for development and start the Retype dev server. If you are experiencing issue with the license, refer to the [setup Retype section](#setup-retype).

```bash
pnpm dev-docs
```

### test

Run the packages & sample application unit tests.

```bash
pnpm test
```

### lint

Lint the packages files & the sample application.

```bash
pnpm lint
```

### changeset

To use when you want to publish a new package version. Will display a prompt to fill in the information about your new release.

```bash
pnpm changeset
```

### clean

Clean the shell packages (delete `dist` folder, clear caches, etc..)

```bash
pnpm clean
```

### reset

Reset the monorepo installation (delete `dist` folders, clear caches, delete `node_modules` folders, etc..)

```bash
pnpm reset
```

### list-outdated-deps

Checks for outdated dependencies. For more information, view [PNPM documentation](https://pnpm.io/cli/outdated).

```bash
pnpm list-outdated-deps
```

### update-outdated-deps

Updated outdated dependencies to their latest version. For more information, view [PNPM documentation](https://pnpm.io/cli/update).

```bash
pnpm update-outdated-deps
```

## CI

We use [GitHub Actions](https://docs.github.com/en/actions) for this repository.

You can find the configuration is in the `.github/workflows` folder and the build results are available [here](https://github.com/workleap/wl-web-configs/actions).

We currently have 3 builds configured:

### Changesets

This action runs on a push on the `main` branch. If there is a file present in the `.changeset` folder, it will publish the new package version on npm.

### CI

This action will trigger when a commit is done in a PR to `main` or after a push to `main`. The action will run `build`, `lint` and `test` commands on the source code.

### Retype

This action will trigger when a commit is done in a PR to `main` or after a push to `main`. The action will generate the documentation website into the `retype` branch. This repository [Github Pages](https://github.com/workleap/wl-web-configs/settings/pages) is configured to automatically deploy the website from the `retype` branch.

If you are having issue with the Retype license, make sure the `RETYPE_API_KEY` Github secret contains a valid Retype license.

## Add a new package to the monorepo

There are a few steps to add new packages to the monorepo.

Before you add a new package, please read the [GSoft GitHub guidelines](https://github.com/workleap/github-guidelines#npm-package-name).

### Create the package

First, create a new folder matching the package name in the [packages](/packages) directory.

Open a terminal, navigate to the newly created directory, and execute the following command:

```bash
pnpm init
```

Answer the CLI questions.

Once the *package.json* is generated, please read again the [GSoft GitHub guidelines](https://github.com/workleap/github-guidelines#npm-package-name) and make sure the package name, author and license are valid.

Don't forget to add the [npm scope](https://docs.npmjs.com/about-scopes) *"@workleap"* before the package name. For example, if the project name is "foo", your package name should be "@workleap/foo".

Make sure the package publish access is *public* by adding the following to the *package.json* file:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### Dependencies

npm *dependencies* and *peerDependencies* must be added to the package own *package.json* file.

## Maintainers notes

### TS moduleResolution

Packages compiled for CommonJS (`browserlists-config`, `eslint-plugin`, `stylelint-configs`) cannot use `moduleResolution: "NodeNext"` because with TS 5.2, it requires to be used in conjunction with `module: "NodeNext"` (but we want `module: "CommonJS"`).

Those packages also cannot use `moduleResolution: "Bundler"` because it requires to use at a minimum `module: "ES2015"`, but again, we want `module: "CommonJS"`.

Therefore, we must use `moduleResolution: "Node"`, which is the equivalent of `Node v10`. A `Node v10` environment doesn't support an `"exports"` field in the `package.json` file according to this [issue](https://github.com/microsoft/TypeScript/issues/51862#issuecomment-1358049778).

Consequently, we must add the `"types"` field to the `package.json` file of the projects that are also compiled for CommonJS.

ESM only package:

```json
{
    "exports": {
        ".": {
            "import": "./dist/index.js",
            "types": "./dist/index.d.ts",
            "default": "./dist/index.js"
        }
    }
}
```

CommonJS only package:

```json
{
    "exports": {
        ".": {
            "require": "./dist/index.js",
            "import": "./dist/index.js",
            "types": "./dist/index.d.ts"
        }
    },
    "types": "./dist/index.d.ts" (for moduleResolution: "Node")
}
```

Dual ESM & CommonJS package:

```json
{
    "exports": {
        ".": {
            "require": {
                "default": "./dist/index.js",
                "types": "./dist/index.d.ts"
            },
            "import": {
                "default": "./dist/index.mjs",
                "types": "./dist/index.d.mts"
            }
        }
    },
    "types": "./dist/index.d.ts" (for moduleResolution: "Node")
}
```

