---
order: 80
label: Migrate from tsup
meta:
    title: Migrate from tsup - Rslib
toc:
    depth: 2-3
---

# Migrate from tsup

To migrate from `@workleap/tsup-configs` to `@workleap/rslib-configs`, execute the following steps 👇

## Update packages

Open a terminal at the root of the library project and install the following packages:

```bash
pnpm add -D @workleap/rslib-configs @rslib/core @rsbuild/core
```

Then, using the same terminal, remove the following packages:

```bash
pnpm remove @workleap/tsup-configs tsup
```

## Create a new `tsconfig.build.json` file

TBD

## Update files

```
library-project
├── tsup.dev.ts     -->  rslib.dev.ts
├── tsup.build.ts   -->  rslib.build.ts
├── tsconfig.json
├── package.json
```

### `tsup.dev.ts`

Rename the file from `tsup.dev.ts` to `rslib.dev.ts`.

Then, open the `rslib.dev.ts` file and and apply the following changes:

- Replace `"@workleap/tsup-configs"` for `"@workleap/rslib-configs"`.
- Add a `tsconfigPath` option and reference the previously created `tsconfig.build.json` file.

Before:

```ts tsup.dev.ts
import { defineDevConfig } from "@workleap/tsup-configs";

export default defineDevConfig();
```

After:

```ts rslib.dev.ts
import { defineDevConfig } from "@workleap/rslib-configs";
import path from "node:path";

export default defineDevConfig({
    tsconfigPath: path.resolve("./tsconfig.build.json")
});
```

### `tsup.build.ts`

Rename the file from `tsup.build.ts` to `rslib.build.ts`.

Then, open the `rslib.build.ts` file and and apply the following changes:

- Replace `"@workleap/tsup-configs"` for `"@workleap/rslib-configs"`.
- Add a `tsconfigPath` option and reference the previously created `tsconfig.build.json` file.

Before:

```ts tsup.build.ts
import { defineBuildConfig } from "@workleap/tsup-configs";

export default defineBuildConfig();
```

After:

```ts rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";
import path from "node:path";

export default defineBuildConfig({
    tsconfigPath: path.resolve("./tsconfig.build.json")
});
```

## Update scripts

### `dev`

Update the `dev` script to run Rslib instead of tsup.

Before:

```json package.json
"scripts": {
    "dev": "tsup --config ./tsup.dev.ts"
}
```

After:

```json package.json
"scripts": {
    "dev": "rslib build -w -c ./rslib.dev.ts"
}
```

### `build`

Update the `build` script to run Rslib instead of tsup.

Before:

```json package.json
"scripts": {
    "build": "tsup"
}
```

After:

```json package.json
"scripts": {
    "build": "rslib build -c ./rslib.build.ts"
}
```

## Typings

If you're encountering typing issues, consider adding type declarations for the following

- [SVGR](./configure-dev.md#typings)
- [CSS Module](./configure-dev.md#css-modules-typings)

## Storybook

Consider using the new Rslib [Storybook](./configure-storybook.md) shared configurations.

## Try it :rocket:

Start the application in a development environment using the `dev` and `build` script. Everything should run smoothly without any warnings or errors outputted in the terminal.


