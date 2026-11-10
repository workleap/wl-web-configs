---
"@workleap/stylelint-configs": patch
---

The bundled agent skill now sets up a CSS-scoped `.prettierrc.json5` instead of the `.prettierignore` that broke oxfmt and hid CSS files in subfolders from Prettier.
