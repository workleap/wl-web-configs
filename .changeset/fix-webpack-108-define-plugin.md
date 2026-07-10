---
"@workleap/webpack-configs": patch
---

Fixed a crash on webpack 5.108+ when `@workleap/webpack-configs` and the consuming application resolve to two different physical copies of webpack in a pnpm workspace (for example when the app depends on `webpack-cli`). `DefinePlugin` is now created from the compiler's own webpack instance (`compiler.webpack`) at apply time instead of from this package's statically imported copy, so it no longer trips webpack 5.108's stricter `instanceof Compilation` check (`The 'compilation' argument must be an instance of Compilation`).
