---
order: 100
label: Configure for development
meta:
    title: Configure for development - Rsbuild
toc:
    depth: 2-3
---

# Configure for development

To configure [Rsbuild](https://rsbuild.dev/) for a development environment, execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the web application project and install the following packages:

+++ pnpm
```bash
pnpm add -D @workleap/rsbuild-configs @workleap/browserslist-config @rsbuild/core @rspack/core browserslist nodemon
```
+++ yarn
```bash
yarn add -D @workleap/rsbuild-configs @workleap/browserslist-config @rsbuild/core @rspack/core browserslist nodemon
```
+++ npm
```bash
npm install -D @workleap/rsbuild-configs @workleap/browserslist-config @rsbuild/core @rspack/core browserslist nodemon
```
+++

## Configure Rsbuild

### HTML template

First, create a `public` folder with an `index.html` file at the root of the project:

``` !#2-3
web-project
├── public
├──── index.html
├── src
├──── ...
├── package.json
```

Then, open the newly created `index.html` file and copy/paste the following content:

```html public/index.html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

The content of the `public/index.html` file will be the template used by Rsbuild [HTML template](https://rsbuild.dev/guide/basic/html-template) feature.

#### Reference local assets

To reference local assets such as a `favicon.png` in the default HTML template, it is recommended to preprend the **relative** path of every asset with the `assetPrefix` option of the Rsbuild config.

First, add the asset to the `public` folder at the root of the project:

``` !#4
web-project
├── public
├──── index.html
├──── favicon.png
├── src
├──── ...
├── package.json
```

Then, add the assets to the `index.html` file:

```html !#4 public/index.html
<!DOCTYPE html>
<html>
    <head>
        <link href="<%=assetPrefix%>/favicon.png" rel="icon">
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

### Browserslist

Next, let's set up [Browserlist](https://github.com/browserslist/browserslist) to define the minimum browser versions supported by the application. Rsbuild will automatically detect and load the browser versions from the nearest `.browserslistrc` configuration file.

First, create a `browserslistrc` file at the root of the project:

``` !#6
web-project
├── public
├──── index.html
├── src
├──── ...
├── .browserslistrc
├── package.json
```

Then, open the newly created file and extend the default configuration with the shared configuration provided by `@workleap/browserslist-config`:

``` .browserslistrc
extends @workleap/browserslist-config
```

### `rsbuild.dev.ts`

Next, create a configuration file named `rsbuild.dev.ts` at the root of the project:

``` !#8
web-project
├── public
├──── index.html
├── src
├──── ...
├── .browserslistrc
├── package.json
├── rsbuild.dev.ts
```

Then, open the newly created file and `export` the Rsbuild configuration by using the `defineDevConfig(options)` function:

```ts rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig();
```

## Use predefined options

The `defineDevConfig(options)` function can be used as shown in the previous example, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `entry`

- **Type**: An object literal accepting any [source.entry](https://rsbuild.dev/config/source/entry) options.
- **Default**: `{ index: "./src/index.tsx" }`

Set Rsbuild [source.entry](https://rsbuild.dev/config/source/entry) option.

```ts !#5 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    entry: {
        index: "./src/another-entry.tsx"
    }
});
```

### `https`

- **Type**: `boolean` or an object literal accepting any [server.https](https://rsbuild.dev/config/server/https) options.
- **Default**: `false`

Set Rsbuild [server.https](https://rsbuild.dev/config/server/https) option and format Rsbuild [dev.assetPrefix](https://rsbuild.dev/config/dev/asset-prefix) option accordingly.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    https: true
});
```

When `true`, a self-signed certificate will be generated with [rsbuild-plugin-basic-ssl](https://github.com/rspack-contrib/rsbuild-plugin-basic-ssl). To manually set a certificate, follow Rsbuild [instructions](https://rsbuild.dev/config/server/https#set-certificate).

### `host`

- **Type**: `string`
- **Default**: `localhost`

Set Rsbuild [server.host](https://rsbuild.dev/config/server/host) option and format Rsbuild [dev.assetPrefix](https://rsbuild.dev/config/dev/asset-prefix) option accordingly.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    host: "my-custom-host"
});
```

### `port`

- **Type**: `number`
- **Default**: `8080`

Set Rsbuild [server.port](https://rsbuild.dev/config/server/port) option and format Rsbuild [dev.assetPrefix](https://rsbuild.dev/config/dev/asset-prefix) option accordingly.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    port: 1234
});
```

### `assetPrefix`

> This option is the Rsbuild equivalent of webpack [publicPath](../webpack/configure-dev.md#publicpath) option.

- **Type**: `string`
- **Default**: `${https ? "https" : "http"}://${host}:${port}`

Set Rsbuild [dev.assetPrefix](https://rsbuild.dev/config/dev/asset-prefix) option. Only set this option if the dev server is not hosting the application at the root.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    assetPrefix: "http://dev-host:8080"
});
```

### `plugins`

- **Type**: An array of Rsbuild [plugin instances](https://rsbuild.dev/plugins/list/index)
- **Default**: `[]`

Append the provided Rsbuild plugins to the configuration.

```ts !#5 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";
import { pluginAssetsRetry } from "@rsbuild/plugin-assets-retry";

export default defineDevConfig({
    plugins: [pluginAssetsRetry()]
});
```

### `html`

- **Type**: `false` or `(defaultOptions: HtmlConfig) => HtmlConfig`
- **Default**: `defaultOptions => defaultOptions`

By default, Rsbuild will attempt to load an HTML template from the `public/index.html` file. To use Rsbuild's built-in HTML template instead, set the option to `false`.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    html: false
});
```

To customize the default [HTML template](https://rsbuild.dev/guide/basic/html-template) configuration, provide a function extending the default options.

```ts !#5-10 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";
import path from "node:path";

export default defineDevConfig({
    html: defaultOptions => {
        return {
            ...defaultOptions,
            template: path.resolve("./my-custom-index.html"),
        };
    }
});
```

### `lazyCompilation`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to use [lazy compilation](https://rsbuild.dev/config/dev/lazy-compilation). To disable lazy compilation, set the option to `false`.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    lazyCompilation: false
});
```

### `hmr`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to use [HMR](https://rsbuild.dev/guide/advanced/hmr). To disable HMR set the option to `false`.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    hmr: false
});
```

### `fastRefresh`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to use [Fast Refresh](https://rsbuild.dev/guide/framework/react#react-fast-refresh) instead of use [HMR](https://rsbuild.dev/guide/advanced/hmr). To disable fast refresh set the option to `false`.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    fastRefresh: false
});
```

To customize the Fast Refresh [configuration](https://rsbuild.dev/plugins/list/plugin-react#reactrefreshoptions), provide a [react](#react) function extending the default options.

```ts !#4-11 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    react: defaultOptions => {
        return {
            ...defaultOptions,
            reactRefreshOptions: {
                overlay: false
            }
        };
    }
});
```

### `sourceMap`

- **Type**: `false` or an object literal accepting any [output.sourceMap](https://rsbuild.dev/config/output/source-map) options.
- **Default**: `{ js: "cheap-module-source-map", css: true }`

Whether or not to generate [source maps](https://rsbuild.dev/config/output/source-map). To disable source map, set the option to `false`. 

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    sourceMap: false
});
```

To customize the source map [configuration](https://rsbuild.dev/config/output/source-map), provide an object literal.

```ts !#4-6 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    sourceMap: {
        css: false
    }
});
```

### `overlay`

- **Type**: `false`
- **Default**: `undefined` 

Whether or not a full-screen overlay should be in the browser when there are compiler errors or warnings.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    overlay: false
});
```

### `writeToDisk`

- **Type**: `true`
- **Default**: `undefined`

Whether or not to [write the build output](https://rsbuild.dev/config/dev/write-to-disk) from the development server to the disk.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    writeToDisk: true
});
```

### `react`

- **Type**: `false` or `(defaultOptions: PluginReactOptions) => PluginReactOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to transform React code. To disable React code transformation, set the option to `false`.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    react: false
});
```

To customize [plugin-react](https://rsbuild.dev/plugins/list/plugin-react), provide a function to extend the default options.

```ts !#4-12 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    react: defaultOptions => {
        return {
            ...defaultOptions,
            swcReactOptions: {
                ...(defaultOptions.swcReactOptions ?? {}),
                runtime: "classic"
            }
        };
    }
});
```

### `svgr`

- **Type**: `false` or `(defaultOptions: PluginSvgrOptions) => PluginSvgrOptions`
- **Default**: `defaultOptions => defaultOptions`

Whether or not to handle `.svg` files with [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr). When the option is set to `false`, the `.svg` files will be handled by the `asset/resource` rule.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    svgr: false
});
```

To customize the [plugin-svgr](https://rsbuild.dev/plugins/list/plugin-svgr), provide a function extending the default options.

```ts !#4-13 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    svgr: defaultOptions => {
        return {
            svgrOptions: {
                ...(defaultOptions.svgrOptions ?? {}),
                ref: true
            }
            ...defaultOptions,

        }
    }
});
```

#### Typings

When an SVG asset in referenced in TypeScript code, TypeScript may prompt that the module is missing a type definition:

```bash
TS2307: Cannot find module './logo.svg' or its corresponding type declarations.
```

To fix this, add a type declaration for the SVG assets, by creating a `src/env.d.ts` file, and add the type declaration.

```ts src/env.d.ts
declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
}
declare module '*.svg?react' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

For additional information, refer to the plugin [documentation](https://rsbuild.dev/plugins/list/plugin-svgr#type-declaration).

#### Import images

By default, `plugin-svgr` is configured to support [named import](https://rsbuild.dev/plugins/list/plugin-svgr#named-import) for `ReactComponent`:

```tsx
import { ReactComponent as Logo } from "./logo.svg";

export const App = () => <Logo />;
```

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

Start the Rsbuild process with verbose logging turned on.

```ts !#4 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    verbose: true
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default development configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/dev.ts) of `@workleap/rsbuild-configs`, but only covers a subset of an [Rsbuild configuration](https://rsbuild.dev/config/index). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineDevConfig` function. Remember, **no locked in** :heart::v:.

To view the default development configuration of `@workleap/rsbuild-configs`, have a look at the [dev.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/rsbuild-configs/src/dev.ts) on GitHub.

### `transformers`

- **Type**: `((config: RsbuildConfig, context: RsbuildConfigTransformerContext) => RsbuildConfig)[]`
- **Default**: `[]`

```ts
transformer(config: RsbuildConfig, context: RsbuildConfigTransformerContext) => RsbuildConfig
```

```ts !#4-14,17 rsbuild.dev.ts
import { defineDevConfig, type RsbuildConfigTransformer } from "@workleap/rsbuild-configs";
import type { RsbuildConfig } from "@rsbuild/core";

const forceNamedChunkIdsTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
    config.tools = config.tools ?? {};
    config.tools.rspack = config.tools.rspack ?? {};

    config.tools.rspack.optimization = {
        ...(config.tools.rspack.optimization ?? {}),
        chunkIds: "named"
    };

    return config;
};

export default defineDevConfig({
    transformers: [forceNamedChunkIdsTransformer]
});
```

### Execution context

Generic transformers can use the `context` parameter to gather additional information about their execution context, like the `environment` they are operating in.

```ts !#5 transformer.ts
import type { RsbuildConfigTransformer } from "@workleap/rsbuild-configs";
import type { RsbuildConfig } from "@rsbuild/core";

export const transformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
    if (context.environment === "dev") {
        config.tools = config.tools ?? {};
        config.tools.rspack = config.tools.rspack ?? {};

        config.tools.rspack.optimization = {
            ...(config.tools.rspack.optimization ?? {}),
            chunkIds: "named"
        };
    }

    return config;
}
```

- `environment`: `"dev" | "build" | "storybook"`
- `verbose`: `boolean`

## Setup nodemon

A tool such as [Nodemon](https://nodemon.io/) is not required with Rsbuild because the development server is automatically restarted when the configuration file is updated.

## Add a CLI script

To initiate the development server, add the following script to the project `package.json` file:

```json package.json
{
    "dev": "nodemon"
}
```

## Define environment variables

### cross-env

We recommend to define environment variables using [cross-env](https://github.com/kentcdodds/cross-env). With `cross-env`, the environment variables will be made available to any Node.js files that are executed by the script process (`dev` in the example below :point_down:):

```json package.json
{
    "dev": "cross-env DEBUG=true nodemon"
}
```

```ts !#4 tsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

if (process.env.DEBUG) {
    console.log("Configuring Rsbuild in debug mode!");
}

export default defineDevConfig();
```

However, there's a catch. When using `cross-env`, the variables will not be available in the application files because `cross-env` only makes them available to files that are executed by the process at **build time** while the application files are executed at **runtime** by a browser.

To make them accessible to the application files, Rsbuild must be aware of those environment variables and **render** them into the **compiled application files**. This is the purpose of the `environmentVariables` option.

### `environmentVariables`

- **Type**: `Record<string, unknown>`
- **Default**: `{}`

First, define the variables with `environmentVariables`:

```ts !#4-6 rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig({
    environmentVariables: {
        "DEBUG": process.env.DEBUG === "true"
    }
});
```

Then, use the variables in any application files:

```tsx !#2 src/App.tsx
export function App() {
    if (process.env.DEBUG) {
        console.log("The application has been bootstrapped in debug!");
    }

    return null;
}
```

!!!info
The `=== "true"` part of `"DEBUG": process.env.DEBUG === "true"` is very important, otherwise the environment variable value would be `"true"` instead of `true`.
!!!

!!!info
By default, Rsbuild injects a few environment variables into the code using the [source.define](https://rsbuild.dev/guide/advanced/env-vars#using-define) option. For additional information about these default environment variables, refer to the Rsbuild [documentation](https://rsbuild.dev/guide/advanced/env-vars#default-variables).
!!!

## CSS modules typings

When CSS Modules are imported from TypeScript code, TypeScript may prompt that the module is missing a type definition:

```bash
TS2307: Cannot find module './index.module.css' or its corresponding type declarations.
```

To fix this, add a type declaration file for the CSS Modules, by creating a `src/env.d.ts` file, and adding the corresponding type declaration.

```ts env.d.ts
/// <reference types="@rsbuild/core/types" />
```

### Monorepo

If the solution is a monorepo, ensure that projects referencing the packages that include CSS Modules, also include the necessary type definitions

For example, given the following structure:

``` !#3,7
workspace
├── app
├──── tsconfig.ts
├── packages
├──── components
├────── src
├───────── Button.tsx
├───────── Button.module.css
├───────── env.d.ts
├───────── tsconfig.ts
├── package.json
```

Copy the CSS Modules typings into the `app` web application own `env.d.ts` file, or include the `components` package's typings into the `apps` web application `tsconfig.ts` configuration file:

```json !#5 app/tsconfig.ts
{
    "extends": "@workleap/typescript-configs/web-application.json",
    "include": [
        ".",
        "../**/src/env.d.ts"
    ],
    "exclude": ["public", "dist", "node_modules"]
}
```

!!!info
For additional information about CSS modules type declaration, refer to the Rsbuild [documentation](https://rsbuild.dev/guide/basic/css-modules#type-declaration).
!!!

## Try it :rocket:

To test the new Rsbuild configuration, open a terminal at the root of the project and execute the [CLI script added earlier](#add-a-cli-script). A development server should start without outputting any error in the terminal.


