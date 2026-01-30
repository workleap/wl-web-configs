Using the **"skill-creator"** skill, create an agent skill for the **`wl-web-configs`** library, based exclusively on its official documentation.

The purpose of this skill is to help developers correctly understand, adopt, and customize Workleap’s shared web configuration packages in a consistent and documented way.

The skill should enable an agent to:

* Explain what `wl-web-configs` is and what problems it solves for web projects at Workleap.
* Describe the overall philosophy of the library, including supported tools, target environments, and the “no lock-in” approach.
* Help developers choose the correct configuration packages depending on their project type (web application, library, monorepo workspace).
* Provide clear examples of how to install, configure, extend, and override shared configurations.
* Answer developer questions using **only documented packages, exports, and recommended patterns**.

The skill must:

* Not invent configuration APIs, options, presets, or behaviors that are not documented.
* Not suggest undocumented, deprecated, or discouraged approaches.
* Not provide generic ESLint, TypeScript, or build-tool advice unless it directly maps to `wl-web-configs`.
* Ignore libraries that are in maintenance mode.

The agent should assume:

* A modern JavaScript/TypeScript codebase.
* ESM / ESNext as the default target environment unless otherwise stated.
* Projects are using Workleap’s shared configuration packages rather than fully custom setups.
* The user is working in either a polyrepo or a monorepo (including tools like Turborepo).

The generated skill should:

* Provide clear, concise, and actionable explanations.
* Favor copy/paste-ready install steps and configuration examples.
* Be reliable for pull request reviews, developer support, and onboarding.
* Minimize token usage by focusing only on relevant `wl-web-configs` concepts and packages.

Relevant questions the skill should be able to answer:

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

The documentation is located in the "docs" folder. Only use the documentation of the following folders:

* ./docs/introduction
* ./docs/browserslist
* ./docs/eslint
* ./docs/rsbuild
* ./docs/rslib
* ./docs/stylelint
* ./docs/typescript
* ./samples.md

The skill should at least trigger when the agent encounters questions about:

* Setting up or modifying shared web tooling configurations
* ESLint, Stylelint, TypeScript, Rsbuild, Rslib, Browserlist, Storybook, or related config packages from `wl-web-configs`
* Customizing or extending shared configurations
* Monorepo vs polyrepo configuration strategies
* ESM / ESNext configuration constraints
* Troubleshooting configuration or compatibility issues
