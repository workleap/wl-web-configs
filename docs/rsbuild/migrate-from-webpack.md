---
order: 60
label: Migrate from webpack
meta:
    title: Migrate from webpack - Rsbuild
toc:
    depth: 2-3
---

# Migrate from webpack

To migrate from [@workleap/webpack-configs](https://www.npmjs.com/package/@workleap/webpack-configs) to [@workleap/rsbuild-configs](https://www.npmjs.com/package/@workleap/rsbuild-configs), execute the following steps :point_down:

## Update packages

Open a terminal at the root of the web application project and install the following packages:

```bash
pnpm add -D @workleap/rsbuild-configs @rsbuild/core @rspack/core
```

Then, using the same terminal, remove the following packages:

```bash
pnpm remove @workleap/webpack-configs @swc/core @swc/helpers @workleap/swc-configs webpack webpack-cli webpack-dev-server @workleap/postcss-configs postcss
```

!!!warning
If your web application project uses SWC for tests, you may want to keep the `@swc/core` and `@workleap/swc-configs` packages.
!!!

## Update files

```
web-project
├── public
├──── index.html       -->  U
├── webpack.dev.js     -->  rsbuild.dev.ts
├── webpack.build.js   -->  rsbuild.build.ts
├── postcss.config.ts  -->  X
├── swc.build.js       -->  X
├── swc.dev.js         -->  X
├── package.json
```

### `webpack.dev.js`

Rename the file from `webpack.dev.js` to `rsbuild.dev.ts`.

Then, open the `rsbuild.build.ts` file and and apply the following changes:

- Replace `"@workleap/webpack-configs"` for `"@workleap/rsbuild-configs"`.
- Remove `import { swcConfig } from "./swc.build.js"`.
- Remove the argument of the `defineDevConfig` function.
- Remove `// @ts-check`.

Before:

```js webpack.dev.js
// @ts-check

import { defineDevConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.dev.js";

export default defineDevConfig(swcConfig);
```

After:

```ts rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig();
```

### `webpack.build.js`

Rename the file from `webpack.build.js` to `rsbuild.build.ts`.

Then, open the `rsbuild.build.ts` file and apply the following changes:

- Replace `"@workleap/webpack-configs"` for `"@workleap/rsbuild-configs"`.
- Remove `import { swcConfig } from "./swc.build.js"`.
- Remove the argument of the `defineBuildConfig` function.
- Remove `// @ts-check`.

Before:

```js webpack.build.js
// @ts-check

import { defineBuildConfig } from "@workleap/webpack-configs";
import { swcConfig } from "./swc.build.js";

export default defineBuildConfig(swcConfig);
```

After:

```ts rsbuild.build.ts
import { defineBuildConfig } from "@workleap/rsbuild-configs";

export default defineBuildConfig();
```

### `postcss.config.ts`

Delete the `postcss.config.ts` file.

### `swc.build.js`

Delete the `swc.build.js` file.

### `swc.dev.js`

Delete the `swc.dev.js` file.

### `index.html`

Replace `<%=webpackConfig.output.publicPath%>` by `<%=assetPrefix%>/` (the `/` is important).

Before:

```html public/index.html
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

After:

```html public/index.html
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

## Update scripts

### `dev`

Update the `dev` script to run Rsbuild instead of webpack.

Before:

```json package.json
"scripts": {
    "dev": "webpack serve --config webpack.dev.js"
}
```

After:

```json package.json
"scripts": {
    "dev": "rsbuild dev --config rsbuild.dev.ts"
}
```

### `build`

Update the `build` script to run Rsbuild instead of webpack.

Before:

```json package.json
"scripts": {
    "build": "webpack --config webpack.build.js"
}
```

After:

```json package.json
"scripts": {
    "build": "rsbuild build --config rsbuild.build.ts"
}
```

## Typings

If you're encountering typing issues, consider adding type declarations for the following

- [SVGR](./configure-dev.md#typings)
- [CSS Module](./configure-dev.md#css-modules-typings)

## Storybook

Consider using the new Rsbuild [Storybook](./configure-storybook.md) shared configurations.

## Try it :rocket:

Start the application in a development environment using the `dev` and `build` script. Everything should run smoothly without any warnings or errors outputted in the terminal.
