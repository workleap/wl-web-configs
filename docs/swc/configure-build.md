---
order: 90
label: Configure for build
meta:
    title: Configure for build - SWC
toc:
    depth: 2-3
---

# Configure for build

!!!warning
`@workleap/swc-configs` is now in maintenance mode for the shared __build__ configuration. If you're starting a new project, consider using [@workleap/rsbuild-configs](../rsbuild/default.md) instead for better performance and modern tooling which eliminates the needs for a custom SWC configuration.
!!!

To configure [SWC](https://swc.rs/) for a production environment, execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the project and install the following packages:

```bash
pnpm add -D @workleap/swc-configs @swc/core @swc/helpers
```

## Configure SWC

First, create a configuration file named `swc.build.js` at the root of the project:

``` !#5
web-project
├── src
├──── ...
├── package.json
├── swc.build.js
```

Then, open the newly created file and export the SWC configuration by using the `defineBuildConfig(targets, options)` function:

```js !#5,7 swc.build.js
// @ts-check

import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineBuildConfig(targets);
```

### `targets`

In the previous code sample, the `defineBuildConfig(targets, options)` function receives a list of **minimal browser versions to support** through the `targets` parameter.

The expected behavior for the supported browsers would be for SWC to automatically load the minimal browser versions from the closest `.browserslistrc` [configuration file](https://github.com/browserslist/browserslist#browserslistrc). However, there is currently an [issue](https://github.com/swc-project/swc/issues/3365) preventing SWC from doing so when the configuration file include a query referencing an external [Browserslist](https://browsersl.ist/) configuration:

```.browserslistrc
extends @workleap/browserslist-config
```

Therefore, `@workleap/swc-configs` has chosen to **delegate** the loading of the Browserslist configuration **to the consumer** by making the `targets` option required.

### `browserslistToSwc`

To help consumers provide SWC [targets](https://swc.rs/docs/configuration/supported-browsers#targets) from a Browserslist configuration, `@workleap/swc-configs` offers the `browserslistToSwc(options)` utility function.

This function can either transform an array of Browserslist [queries](https://github.com/browserslist/browserslist#queries) to SWC targets:

```js !#5 swc.dev.js
// @ts-check

import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc({ queries: ["extends @workleap/browserslist-config"] })

export const swcConfig = defineBuildConfig(targets);
```

Or load the closest `.browserslistrc` configuration file and convert the queries into SWC targets:

```.browserslistrc
extends @workleap/browserslist-config
```

```js !#5 swc.build.js
// @ts-check

import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineBuildConfig(targets);
```

The `browserslistToSwc(options)` utility function accepts any option supported by Browserslist [JS API](https://github.com/browserslist/browserslist#js-api) in addition to a `queries` option:

- `queries`: `string | string[]`

## Use predefined options

The `defineBuildConfig(targets, options)` function can be used as shown in the previous example, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `baseUrl`

- **Type**: `string`

Sets a base directory from which to resolve module names. This option is usually provided when custom [paths](#paths) are provided. Note that SWC requires the `baseUrl` to be an absolute path.

```js !#9 swc.build.js
// @ts-check

import path from "node:path";
import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineBuildConfig(targets, {
    baseUrl: path.resolve("src")
});
```

### `parser`

- **Type**: `"ecmascript" | "typescript"`
- **Default**: `"typescript"`

Whether SWC should expect to parse JavaScript or TypeScript code.

```js !#8 swc.build.js
// @ts-check

import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineBuildConfig(targets, {
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
import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

export const swcConfig = defineBuildConfig(targets, {
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

The [predefined options](#use-predefined-options) are useful to quickly customize the [default build configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/swc-configs/src/build.ts) of `@workleap/swc-configs`, but only covers a subset of an [SWC configuration](https://swc.rs/docs/configuration/swcrc). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineBuildConfig` function. Remember, **no locked in** :heart::v:.

To view the default development configuration of `@workleap/swc-configs`, have a look at the [build.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/swc-configs/src/build.ts) on GitHub.

### `transformers`

- **Type**: `((config: SwcConfig, context: SwcConfigTransformerContext) => SwcConfig)[]`
- **Default**: `[]`

```ts
transformer(config: SwcConfig, context: SwcConfigTransformerContext) => SwcConfig
```

```js !#10-14,17 swc.build.js
// @ts-check

import { browserslistToSwc, defineBuildConfig } from "@workleap/swc-configs";

const targets = browserslistToSwc();

/**
 * @type {import("@workleap/swc-configs").SwcConfigTransformer}
 */
function mangleMinifiedCode(config) {
    config.jsc.minify.mangle = true;

    return config;
}

export const swcConfig = defineBuildConfig(targets, {
    transformers: [mangleMinifiedCode]
});
```

### Execution context

Generic transformers can use the `context` parameter to gather additional information about their execution context, like the `environment` they are operating in:

```ts !#7 transformer.js
// @ts-check

/**
 * @type {import("@workleap/swc-configs").SwcConfigTransformer}
 */
export function transformer(config, context) {
    if (context.environment === "build") {
        config.jsc.minify.mangle = true;
    }

    return config;
};
```

- `environment`: `"dev" | "build" | "jest"`

## Configure webpack

To integrate with webpack, update your configuration file to include an [swc-loader](https://swc.rs/docs/usage/swc-loader):

```js !#10 webpack.config.js
// @ts-check

import { swcConfig } from "./swc.build.js";

export default {
    ...
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)/i,
                exclude: /node_modules/,
                use: {
                    loader: "swc-loader",
                    options: swcConfig
                }
            }
        ]
    }
}
```

## Try it :rocket:

To test your new [SWC](https://swc.rs/) configuration, create a Typescript file with the following code:

```ts say.ts
export function say(string: value) {
    console.log(value);
}
```

If you integrated SWC with webpack, make sure to import the previously created file in one of your webpack [entry points](https://webpack.js.org/concepts/entry-points/), then execute your webpack build and find the transpiled code in the generated bundle files of your `dist` folder.

Otherwise, open a terminal at the root of your project and install [@swc/cli](https://swc.rs/docs/usage/cli):

```bash
pnpm add -D @swc/cli @swc/core
```

Then, process the file with `@swc/cli` by executing the following command in the same terminal:

```bash
npx swc ./say.ts -o say.js --config-file swc.build.js
```

Whether you processed the file with webpack or `@swc/cli`, the transpiled code should be:

```js say.js
export function say(value) {
    console.log(value);
}
```
