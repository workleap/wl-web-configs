---
name: workleap-browserslist-config
description: |
  Workleap's shared Browserslist config (`@workleap/browserslist-config`). Use when adding or customizing a `.browserslistrc` in a project that uses `@workleap/browserslist-config`, adding custom browser targets, listing the supported browser versions, or deciding whether a project (application vs library) should include Browserslist at all.
---

# @workleap/browserslist-config

## Overview

`@workleap/browserslist-config` provides the browser targets for Workleap web applications. Bundlers such as Rsbuild read the project's `.browserslistrc` to decide the output syntax and polyfills.

**Applications only**: Only set up Browserslist for projects that emit application bundles. Libraries should not include Browserslist — the consuming application's Browserslist controls the final output targets.

## Installation

```bash
pnpm add -D @workleap/browserslist-config browserslist
```

## Configuration

Create a `.browserslistrc` file at the root of the project:

```text
web-project
├── src
├──── ...
├── package.json
├── .browserslistrc
```

Extend the shared configuration:

```text
# .browserslistrc
extends @workleap/browserslist-config
```

## Custom Browser Targets

To add browser versions not covered by the shared configuration, append extra queries after the `extends` line:

```text
# .browserslistrc
extends @workleap/browserslist-config
IE 11
last 2 OperaMobile 12.1 versions
```

Refer to the [Browserslist documentation](https://github.com/browserslist/browserslist#full-list) for the full list of available queries.

## List the Supported Browsers

Open a terminal at the root of a project that includes a `.browserslistrc` file and run:

```bash
pnpm browserslist
```

The exhaustive list of browser versions included with the shared configuration is also available on [browsersl.ist](https://browsersl.ist/#q=last+2+versions%2C+%3E+0.2%25%2C+Firefox+ESR%2C+not+dead%2C+not+op_mini+all%2C+not+kaios+%3E+0%2C+not+and_uc+%3E+0%2C+not+and_qq+%3E+0).

## Critical Rules

1. **Applications only** — never add Browserslist to a library; the consuming application's config controls the final output targets
2. **Extend, don't copy** — keep `extends @workleap/browserslist-config` as the first line and append custom queries after it, so updates to the shared targets keep flowing in through package bumps
