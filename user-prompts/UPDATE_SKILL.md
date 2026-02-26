Review the `workleap-web-configs` skill you created in the `./agent-skills/workleap-web-configs` directory and make sure that all API definition and examples match the current documentation available in the `./docs` folder. Ignore libraries in maintenance mode, vitest, syncpack, Chromatic or updates. Do not make mistake.

Never update a versioned skill. You can identify a versioned skill with its folder name pattern, e.g. `workleap-<name>-v*`.

After making changes to the skill, spawn a review agent using the **opus** model to validate that the skill can still answer the following questions:

* What is wl-web-configs and what shared configuration packages does it provide?
* What is the design philosophy behind the shared configs (ESM/ESNext, no lock-in, by project type)?
* Which tools are actively supported and which are in maintenance mode?
* How do I pick the right ESLint configuration for my project type (web app, React library, TS library, monorepo)?
* How do I install and set up `@workleap/eslint-configs` for a React web application?
* How do I customize or extend the shared ESLint configuration with additional rules or plugins?
* What rule categories does `@workleap/eslint-configs` provide, and how do I switch the test framework from Vitest to Jest?
* Which TypeScript config file should I extend for a web application versus a library versus a monorepo workspace root?
* How do I override specific TypeScript compiler options while still using the shared config?
* What are the TypeScript advanced composition configs (`core.json`, `react.json`), and how do I configure monorepo path mappings?
* How do I set up `@workleap/rsbuild-configs` for development, production builds, and Storybook?
* How do I set up `@workleap/rslib-configs` for building a library, and what is the difference between bundleless and bundle mode?
* How do I install and configure `@workleap/stylelint-configs` and integrate it with Prettier?
* How do I customize Stylelint rules (disable, change severity, add plugins), and what CSS preprocessor limitations exist?
* How do I set up and customize `@workleap/browserslist-config`, and why should it only be used in applications?
* How do I use configuration transformers (`RsbuildConfigTransformer` / `RslibConfigTransformer`) for advanced config customization?
* What type declarations (`env.d.ts`) are needed for SVG imports and CSS Modules in Rsbuild and Rslib projects?
* What are the differences in configuration between a monorepo (Turborepo) setup and a polyrepo setup?
