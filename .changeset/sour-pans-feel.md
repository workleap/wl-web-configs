---
"@workleap/rsbuild-configs": minor
---

Updated the Storybook config to disable module concatenation until the Rspack stats feature is fixed. It was preventing Chromatic's Turbosnap from working properly in a monorepo setup. Also bumped the dependencies.
