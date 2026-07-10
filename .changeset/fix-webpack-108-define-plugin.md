---
"@workleap/webpack-configs": minor
---

Added support for webpack 5.108+.

Previously, on webpack 5.108+, a pnpm workspace that resolved two physical copies of webpack (for example when the app depends on `webpack-cli`) crashed with `The 'compilation' argument must be an instance of Compilation`, because `DefinePlugin` was created from this package's own webpack copy instead of the one that owns the compilation. `DefinePlugin` is now created from the compiler's own webpack instance (`compiler.webpack`) at apply time, so it works regardless of how pnpm resolves the peer graph.

The minimum supported `webpack` peer version is now `^5.108.4`.
