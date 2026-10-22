# Migrate from webpack

To move a web application from `@workleap/webpack-configs` to `@workleap/rsbuild-configs`:

### 1. Update the packages

```bash
pnpm add -D @workleap/rsbuild-configs @rsbuild/core @rspack/core
pnpm remove @workleap/webpack-configs @swc/core @swc/helpers @workleap/swc-configs webpack webpack-cli webpack-dev-server @workleap/postcss-configs postcss
```

Keep `@swc/core` and `@workleap/swc-configs` if the project still uses SWC for tests.

### 2. Rename and simplify the config files

`webpack.dev.js` → `rsbuild.dev.ts` and `webpack.build.js` → `rsbuild.build.ts`. In both files, swap the import to `@workleap/rsbuild-configs`, drop the `swcConfig` import and the argument passed to the `define*Config` function, and remove `// @ts-check`:

```ts
// rsbuild.dev.ts
import { defineDevConfig } from "@workleap/rsbuild-configs";

export default defineDevConfig();
```

Delete `postcss.config.ts`, `swc.build.js`, and `swc.dev.js`.

### 3. Update the HTML template

Replace `<%=webpackConfig.output.publicPath%>` with `<%=assetPrefix%>/` — the trailing `/` is important:

```html
<!-- public/index.html -->
<link href="<%=assetPrefix%>/favicon.png" rel="icon">
```

### 4. Update the CLI scripts

```json
{
    "dev": "rsbuild dev --config rsbuild.dev.ts",
    "build": "rsbuild build --config rsbuild.build.ts"
}
```

Then add the [type declarations](../SKILL.md#type-declarations) for SVG and CSS Modules if typing errors appear, and move Storybook to `defineStorybookConfig`.
