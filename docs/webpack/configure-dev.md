---
order: 100
label: Configure for development
meta:
    title: Configure for development - webpack
toc:
    depth: 2-3
---

# Configure for development

!!!warning
`@workleap/webpack-configs` is now in maintenance mode. If you're starting a new project, consider using [@workleap/rsbuild-configs](../rsbuild/getting-started.md) instead for better performance and modern tooling.
!!!

To configure [webpack](https://webpack.js.org/) for a development environment, execute the following steps :point_down:

## Install the packages

Open a terminal at the root of the project and install the following packages:

```bash
pnpm add -D @workleap/webpack-configs webpack webpack-cli webpack-dev-server @swc/core @swc/helpers browserslist postcss nodemon
```

## Configure webpack

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

The content of the `public/index.html` file is the default template that will be used by [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/).

#### Reference local assets

To reference local assets such as a `favicon.png` in the default HTML template, it is recommended to preprend the **relative** path of every asset with the `publicPath` option of the webpack config.

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
        <link href="<%=webpackConfig.output.publicPath%>favicon.png" rel="icon">
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

!!!tip
If `output.publicPath` is set to `auto`, use `href="favicon.png"` instead.
!!!

### `webpack.dev.js`

Next, create a configuration file named `webpack.dev.js` at the root of the project:

``` !#7
web-project
├── public
├──── index.html
├── src
├──── ...
├── package.json
├── webpack.dev.js
```

Then, open the newly created file and `export` the webpack configuration by using the `defineDevConfig(swcConfig, options)` function:

```js !#6 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig);
```

### `swc.dev.js`

In the previous code sample, the `defineDevConfig(swcConfig, options)` function receive an SWC [configuration object](https://swc.rs/docs/configuration/swcrc) through the `swcConfig` parameter. 

Although the [swc-loader](https://swc.rs/docs/usage/swc-loader) defaults to loading the closest `.swcrc` [configuration file](https://swc.rs/docs/configuration/swcrc) when no configuration object is provided, it lacks support for distinct configuration files by environment like webpack does.

Therefore, `@workleap/webpack-configs` choosed to **delegate** the loading of the SWC configuration **to the consumer** by making the `swcConfig` option **required**. 

## Use predefined options

The `defineDevConfig(swcConfig, options)` function can be used as shown in the previous examples, however, if you wish to customize the default configuration, the function also accept a few predefined options to help with that 👇

### `entry`

- **Type**: `string`
- **Default**: `./src/index.tsx`

Set webpack [entry option](https://webpack.js.org/configuration/entry-context/#entry).

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    entry: "./src/another-entry.tsx"
});
```

### `https`

- **Type**: `boolean` | `ServerOptions`
- **Default**: `false`

Set webpack DevServer [https option](https://webpack.js.org/configuration/dev-server/#devserverhttps) and format webpack [publicPath option](https://webpack.js.org/configuration/output/#outputpublicpath) accordingly.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    https: true
});
```

### `host`

- **Type**: `string`
- **Default**: `localhost`

Set webpack DevServer [host option](https://webpack.js.org/configuration/dev-server/#devserverhost) and format webpack [publicPath option](https://webpack.js.org/configuration/output/#outputpublicpath) accordingly.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    host: "my-custom-host"
});
```

### `port`

- **Type**: `number`
- **Default**: `8080`

Set webpack DevServer [port option](https://webpack.js.org/configuration/dev-server/#devserverport) and format webpack [publicPath option](https://webpack.js.org/configuration/output/#outputpublicpath) accordingly.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    port: 1234
});
```

### `publicPath`

- **Type**: `string`
- **Default**: `${https ? "https" : "http"}://${host}:${port}/`

Set webpack [public path](https://webpack.js.org/configuration/output/#outputpublicpath).

```js !#8 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    // The ending "/" is very important.
    publicPath: "http://dev-host:8080/"
});
```

Or for an [automatic](https://webpack.js.org/guides/public-path/#automatic-publicpath) public path:

```js !#7,11 webpack.build.js
// @ts-check

import { defineDevConfig, defineDevHtmlWebpackPluginConfig  } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    publicPath: "auto",
    // If you are using the html webpack plugin, make sure to also set the plugin
    // public path option to "/".
    htmlWebpackPlugin: defineDevHtmlWebpackPluginConfig({
        publicPath: "/"
    })
});
```

### `cache`

- **Type**: `boolean`
- **Default**: `true`

Whether or not webpack [memory cache](https://webpack.js.org/configuration/cache/#cache) is enabled. This will also set [maxGenerations](https://webpack.js.org/configuration/cache/#cachemaxgenerations) to 1 to remove cache entries from memory when they are no longer needed.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    cache: false
});
```

### `moduleRules`

- **Type**: An array of webpack [moduleRule](https://webpack.js.org/configuration/module/#modulerules) objects
- **Default**: `[]`

Append the provided webpack module rules to the configuration.

```js !#7-12 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    moduleRules: [
        {
            test: /\.s[ac]ss$/i,
            use: ["style-loader", "css-loader", "sass-loader"]
        }
    ]
});
```

### `plugins`

- **Type**: An array of webpack [plugin instances](https://webpack.js.org/configuration/plugins/)
- **Default**: `[]`

Append the provided webpack plugins to the configuration.

```js !#8-13 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";
import CircularDependencyPlugin from "circular-dependency-plugin";

export default defineDevConfig(swcConfig, {
    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            include: /src/
        });
    ]
});
```

### `htmlWebpackPlugin`

- **Type**: `boolean` or an object literal accepting any `html-webpack-plugin` [option](https://github.com/jantimon/html-webpack-plugin#options)
- **Default**: `{ template: "./public/index.html" }`

To remove the default instance of [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/), set the property to `false`.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    htmlWebpackPlugin: false
});
```

To extend/replace the default `html-webpack-plugin` configuration, use the `defineDevHtmlWebpackPluginConfig(options)` function.

```js !#8-11 webpack.dev.js
// @ts-check

import { defineDevConfig, defineDevHtmlWebpackPluginConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";
import path from "node:path";

export default defineDevConfig(swcConfig, {
    htmlWebpackPlugin: defineDevHtmlWebpackPluginConfig({
        template: path.resolve("./my-custom-index.html"),
        minify: true
    })
});
```

### `fastRefresh`

- **Type**: `boolean` or an object literal accepting any `react-refresh-webpack-plugin` [option](https://www.npmjs.com/package/react-refresh/blob/main/docs/API.md)
- **Default**: `true`

Replace webpack [HMR](https://webpack.js.org/concepts/hot-module-replacement/) by [Fast Refresh](https://www.npmjs.com/package/react-refresh). Desactivating webpack fast refresh will automatically [disable fast refresh for SWC](../swc/configure-dev.md#fastrefresh).

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    fastRefresh: false
});
```

To extend/replace the default Fast Refresh configuration, use the `defineFastRefreshPluginConfig(options)` function.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig, defineFastRefreshPluginConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    fastRefresh: defineFastRefreshPluginConfig({ overlay: false })
});
```

- `options`: An object literal accepting any `react-refresh-webpack-plugin` [option](https://www.npmjs.com/package/react-refresh/blob/main/docs/API.md)

### `cssModules`

- **Type**: `boolean`
- **Default**: `false`

Enable `css-loader` [modules](https://webpack.js.org/loaders/css-loader/#modules) feature.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    cssModules: true
});
```

### `overlay`

- **Type**: `false`
- **Default**: `undefined` 

Whether or not a full-screen overlay should be in the browser when there are compiler errors or warnings.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    overlay: false
});
```

### `svgr`

- **Type**: `boolean` or an object literal accepting any `@svgr/webpack` [option](https://react-svgr.com/docs/options/)
- **Default**: `true`

Whether or not to handle `.svg` files with `@svgr/webpack`. If `@svgr/webpack` is desactived, the `.svg` files will be handled by the `asset/resource` rule.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    svgr: false
});
```

To extends the `@svgr/webpack` rule configuration, provide an object literal instead.

```js !#7-9 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    svgr: {
        ref: true
    }
});
```

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

Start the webpack process with verbose logging turned on.

```js !#7 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
    verbose: true
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#use-predefined-options) are useful to quickly customize the [default development configuration](https://github.com/workleap/wl-web-configs/blob/main/packages/webpack-configs/src/dev.ts) of `@workleap/webpack-configs`, but only covers a subset of a [webpack configuration](https://webpack.js.org/configuration/). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `defineDevConfig` function. Remember, **no locked in** :heart::v:.

To view the default development configuration of `@workleap/webpack-configs`, have a look at the [dev.ts configuration file](https://github.com/workleap/wl-web-configs/blob/main/packages/webpack-configs/src/dev.ts) on GitHub.

### `transformers`

- **Type**: `((config: WebpackConfig, context: WebpackConfigTransformerContext) => WebpackConfig)[]`
- **Default**: `[]`

```ts
transformer(config: WebpackConfig, context: WebpackConfigTransformerContext) => WebpackConfig
```

```js !#9-15,19 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

/**
 * @type {import("@workleap/webpack-configs").WebpackConfigTransformer}
 */
function enableInMemoryCache(config) {
    config.cache = {
        type: "memory"
    };

    return config;
};

export default defineDevConfig(swcConfig, {
    cache: false,
    transformers: [enableInMemoryCache]
});
```

### Execution context

Generic transformers can use the `context` parameter to gather additional information about their execution context, like the `environment` they are operating in.

```ts !#7 transformer.js
// @ts-check

/**
 * @type {import("@workleap/webpack-configs").WebpackConfigTransformer}
 */
export function transformer(config, context) {
    if (context.environment === "dev") {
        config.cache = {
            type: "memory"
        };
    }

    return config;
};
```

- `environment`: `"dev" | "build"`
- `verbose`: `boolean`

### Utilities

Modifying a webpack configuration object can be an arduous task, to help with that, `@workleap/webpack-configs` offer [utility functions](transformer-utilities.md) for [modules rules](https://webpack.js.org/configuration/module/#modulerules) and [plugins](https://webpack.js.org/configuration/plugins/).

[!ref Transformer utilities](transformer-utilities.md)

## Setup nodemon

[Nodemon](https://nodemon.io/) is a utility that will monitor for any changes in the `swc.dev.js` and `webpack.dev.dev.js` files and restart the webpack development server whenever a change occurs.

First, add a `nodemon.json` file at the root of the project:

``` !#8
web-project
├── public
├──── index.html
├── src
├──── ...
├── package.json
├── webpack.dev.js
├── nodemon.json
```

Then, open the `nodemon.json` file and copy/paste the following content:

```json nodemon.json
{
    "watch": ["swc.dev.js", "webpack.dev.js"],
    "exec": "webpack serve --config webpack.dev.js"
}
```

Finally, add a CLI script at the [next step](#add-a-cli-script) of this guide.

## Add a CLI script

To initiate the development server, add the following script to your project `package.json` file:

```json package.json
{
    "dev": "nodemon"
}
```

## Define environment variables

To deal with environment variables, the webpack documentation suggests using the [--env option](https://webpack.js.org/guides/environment-variables/) from its CLI. While that would work, by using webpack `--env` CLI option, the environment variables would only be made available to the webpack configuration files (.e.g. `webpack.dev.js`) rather than any Node.js files. Therefore we **do not recommend** using webpack `--env` CLI option.

### cross-env

We recommend instead to define environment variables using [cross-env](https://github.com/kentcdodds/cross-env). With `cross-env`, the environment variables will be made available to any Node.js files that are executed by the script process (`dev` in the example below :point_down:):

```json package.json
{
    "dev": "cross-env DEBUG=true nodemon"
}
```

```js !#6 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

if (process.env.DEBUG) {
    console.log("Configuring webpack in debug mode!");
}

export default defineDevConfig(swcConfig);
```

However, there's a catch. When using `cross-env`, the variables will not be available in the application files because `cross-env` only makes them available to files that are executed by the process at **build time** while the application files are executed at **runtime** by a browser.

To make them accessible to the application files, webpack must be aware of those environment variables and **render** them into the **compiled application files**. This is the purpose of the `environmentVariables` option.

### `environmentVariables`

- **Type**: `Record<string, unknown>`
- **Default**: `{}`

First, define the variables with `environmentVariables`:

```js !#7-9 webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig, {
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

!!!tip
The `=== "true"` part of `"DEBUG": process.env.DEBUG === "true"` is very important, otherwise the environment variable value would be `"true"` instead of `true`.
!!!

## Try it :rocket:

To test your new webpack configuration, open a terminal at the root of the project and execute the [CLI script added earlier](#add-a-cli-script). A development server should start without outputting any error in the terminal.


