# Migrate from tsup

To move a library from `@workleap/tsup-configs` to `@workleap/rslib-configs`:

### 1. Update the packages

```bash
pnpm add -D @workleap/rslib-configs @rslib/core @rsbuild/core
pnpm remove @workleap/tsup-configs tsup
```

### 2. Create `tsconfig.build.json`

See [Setup Requirements](../SKILL.md#setup-requirements) — bundleless output needs it.

### 3. Rename the config files

`tsup.dev.ts` → `rslib.dev.ts` and `tsup.build.ts` → `rslib.build.ts`. In both files, swap the import to `@workleap/rslib-configs` and add a `tsconfigPath` option pointing at the new `tsconfig.build.json`:

```ts
// rslib.build.ts
import { defineBuildConfig } from "@workleap/rslib-configs";
import path from "node:path";

export default defineBuildConfig({
    tsconfigPath: path.resolve("./tsconfig.build.json")
});
```

### 4. Update the CLI scripts

```json
{
    "dev": "rslib build -w -c ./rslib.dev.ts",
    "build": "rslib build -c ./rslib.build.ts"
}
```

Then add the [type declarations](../SKILL.md#type-declarations) for SVG and CSS Modules if typing errors appear, and move Storybook to `defineStorybookConfig`.
