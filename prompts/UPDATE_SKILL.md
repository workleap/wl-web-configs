Review the `workleap-web-configs` skill you created in the `./agent-skills/workleap-web-configs` directory and make sure that all API definition and examples match the current documentation available in the `./docs` folder. Ignore libraries in maintenance mode, vitest, syncpack, Chromatic or updates. Do not make mistake.

Never update a versioned skill. You can identify a versioned skill with its folder name pattern, e.g. `workleap-<name>-v*`.

After making changes to the skill, spawn a review agent using the **opus** model to validate that the skill can still answer the following questions:

* What is `wl-web-configs` and what problem does it solve?
* Which tools are officially supported by `wl-web-configs`?
* Which configuration packages should I use for a web application vs a library?
* How do I set up ESLint using `wl-web-configs`?
* How do I set up TypeScript using `wl-web-configs`?
* How do I configure Rsbuild using Workleap’s shared configs?
* How do you configure a library project using the Rslib configuration from wl-web-configs?
* What steps are needed to install and activate the shared ESLint configuration from wl-web-configs?
* How do you add custom TypeScript compiler options while still extending the shared config?
* How does the “no lock-in” approach work in practice?
* How do I share consistent configs across multiple packages?
* How do you override or customize Browserslist targets in a project while still using wl-web-configs?
