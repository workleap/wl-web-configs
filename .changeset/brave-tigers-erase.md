---
"@workleap/typescript-configs": major
---

Enable `erasableSyntaxOnly` in the core TypeScript config.

TypeScript syntax that compiles to runtime code is now a type error: `enum`, constructor parameter properties, value `namespace`s, and `import =` aliases. This keeps the codebase compatible with type-stripping runtimes (Node `--experimental-strip-types`) and erasure-only toolchains.

This is a breaking change for consumers using any of those constructs — replace `enum`s with `as const` object literals and constructor parameter properties with explicit field assignments, or set `"erasableSyntaxOnly": false` in your own `tsconfig.json` to opt out.
