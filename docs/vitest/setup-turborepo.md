---
order: 70
label: Setup with Turborepo
meta:
    title: Setup with Turborepo - Vitest
toc:
    depth: 2-3
---

# Setup with Turborepo

To configure [Vitest](https://vitest.dev/) in a monorepo managed with [Turborepo](https://turborepo.com/), follow these steps 👇

## Setup the workspace

### Install the packages

Open a terminal at the root of the solution's workspace (the root of the repository) and install the following packages:

```bash
pnpm add -D turbo
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
```

Then, open the newly created file and copy/paste the following content:

```json !#5-7
{
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
    "tasks": {
        "test": {
            "outputs": ["node_modules/.cache/vitest/**"]
        }
    }
}
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
```

```json package.json
{
    "test": "turbo run test --continue"
}
```

## Setup a project

### Install the packages

Open a terminal at the root of the project (`packages/pkg-1` for this example) and install the following packages:

```bash
pnpm add -D vitest
```

### Configure Vitest

!!!info
`workleap/web-configs` does not offer any custom configuration for Vitest.
!!!

First, create a configuration file named `vitest.config.ts` at the root of the project:

``` !#7
workspace
├── packages
├──── pkg-1
├────── src
├──────── ...
├────── package.json
├────── vitest.config.ts
├── package.json
├── turbo.json
```

Then, open the newly created file and copy/paste the following content:

```ts packages/pkg-1/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        exclude: ["node_modules", "dist"],
        reporters: "verbose"
    },
    cacheDir: "./node_modules/.cache/vitest"
});
```

!!!tip
For additional information about Vitest, refer to the [Vitest documentation](https://vitest.dev/). 
!!!

### Add a CLI script

Finally, add the following `test` script to your project `package.json` file. This script will be executed by Turborepo:

```json packages/pkg-1/package.json
{
    "test": "vitest --config vitest.config.ts --no-watch"
}
```

## Try it :rocket:

To test your new setup, add a test to the `packages/pkg-1` project:

```ts packages/pkg-1/tests/foo.test.ts
import { test } from "vitest";

test("will always pass", ({ expect }) => {
    expect(true).toBeTruthy();
});
```

Open a terminal at the root of the solution and execute the CLI script added earlier:

```bash
pnpm test
```

The terminal output should indicate that the test suite completed successfully.


