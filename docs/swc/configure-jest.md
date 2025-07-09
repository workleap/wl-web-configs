---
order: 80
label: Configure for Jest
meta:
    title: Configure for Jest - SWC
toc:
    depth: 2-3
---

# Configure for Jest

To configure [SWC](https://swc.rs/) for a [Jest](https://jestjs.io/) environment, execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the project and install the following packages:

```bash
pnpm add -D @workleap/swc-configs @swc/jest @swc/core @swc/helpers
```

## Configure SWC

!!!tip
To use a TypeScript configuration file, make sure that your Jest configuration is also in TypeScript.
!!!

First, create a configuration file named `swc.jest.ts` at the root of the project:

``` !#5
web-project
├── src
├──── ...
├── package.json
├── swc.jest.ts
├── jest.config.ts
```

Then, open the newly created file and export the SWC configuration by using the `defineJestConfig(options)` function:

```ts !#6-8 swc.jest.ts
import { defineJestConfig } from "@workleap/swc-configs";

export const swcConfig = defineJestConfig();
```

## Use predefined options

The `defineJestConfig(options)` function can be used as shown in the previous examples, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `baseUrl`

- **Type**: `string`

Sets a base directory from which to resolve module names. This option is usually provided when custom [paths](#paths) are provided. Note that SWC requires the `baseUrl` to be an absolute path.

```js !#9 swc.build.js
// @ts-check

import path from "node:path";
import { browserslistToSwc, defineJestConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineJestConfig(targets, {
    baseUrl: path.resolve("src")
});
```

### `react`

- **Type**: `boolean`
- **Default**: `false`

Whether or not to transform React code.

```ts !#4 swc.jest.ts
import { defineJestConfig } from "@workleap/swc-configs";

export const swcConfig = defineJestConfig({
    react: true
});
```

### `parser`

- **Type**: `"ecmascript" | "typescript"`
- **Default**: `"typescript"`

Whether SWC should expect to parse JavaScript or TypeScript code.

```ts !#4 swc.jest.ts
import { defineJestConfig } from "@workleap/swc-configs";

export const swcConfig = defineJestConfig({
    parser: "ecmascript"
});
```

### `paths`

!!!warning
You shouldn't need to define custom paths for your project. If you're defining custom paths to support aliases, consider using the [imports](https://medium.com/outbrain-engineering/the-hidden-power-of-package-json-a93143ec0b7c) field of your project's `package.json` file instead.
!!!

- **Type**: `Record<string, string[]>`

A series of entries which re-map imports to lookup locations relative to the [baseUrl](#baseurl) if set.

```js !#10-12 swc.dev.js
// @ts-check

import path from "node:path";
import { browserslistToSwc, defineJestConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineJestConfig(targets, {
    baseUrl: path.resolve("src"),
    paths: {
        "@/*": ["*"]
    }
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default development configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/swc-configs/src/jest.ts) of `@workleap/swc-configs`, but only covers a subset of an [SWC configuration](https://swc.rs/docs/configuration/swcrc). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineJestConfig` function. Remember, **no locked in** :heart::v:.

To view the default Jest configuration of `@workleap/swc-configs`, have a look at the [jest.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/swc-configs/src/jest.ts) on GitHub.

### `transformers`

- **Type**: `((config: SwcConfig, context: SwcConfigTransformerContext) => SwcConfig)[]`
- **Default**: `[]`

```ts
transformer(config: SwcConfig, context: SwcConfigTransformerContext) => SwcConfig
```

```ts !#3-7,10 swc.jest.ts
import { defineJestConfig, type SwcConfigTransformer, type SwcConfig } from "@workleap/swc-configs";

const useCommonJsModules: SwcConfigTransformer = (config: SwcConfig) => {
    config.module.type = "commonjs";

    return config;
};

export const swcConfig = defineJestConfig({
    transformers: [useCommonJsModules]
});
```

## Configure Jest

To configure Jest, open the project `jest.config.ts` file and add the following code:

```ts !#4-6 jest.config.ts
import { swcConfig } from "./swc.jest.ts";

const config = {
    transform: {
        "^.+\\.(ts|tsx)$": ["@swc/jest", swcConfig as Record<string, unknown>]
    }
};
```

## Try it :rocket:

To test your new SWC configuration, create a Jest test in Typescript:

```ts appendWorld.test.ts
export function appendWorld(string: value) {
    console.log(`${string} world!`);
}

test("should append \"world!\"", () => {
    expect(appendWorld("Hello")).toBe("Hello world!");
}
```

Open a terminal and run Jest directly from the CLI:

```bash
pnpm jest
```

The test should succeed without any error outputted to the console.
