---
order: 100
label: Best practices
meta:
    title: Best practices - Chromatic
toc:
    depth: 2-3
---

# Best practices

To help Workleap stay within its monthly [Chromatic](https://www.chromatic.com/) snapshot budget, we ask teams to follow these best practices.

!!!tip
For CI workflow examples, see the [setup a Chromatic workflow](./setup-a-workflow.md) and [setup a Chromatic workflow with Turborepo](./setup-turborepo-workflow.md) pages.
!!!

## Must follow

### Use TurboSnap

Make sure [TurboSnap](https://www.chromatic.com/docs/turbosnap/) is enabled, and periodically check how many snapshots were captured for your builds with and without TurboSnap.

You can log into Chromatic and navigate to a build's details to confirm if TurboSnap is enabled for a specific build. If you don't see the _"TurboSnap"_ ribbon on the right side of the screen, it most likely means TurboSnap is not enabled for that project.

:white_check_mark: Good

:::align-image-left
![Turbosnap runned example](../static/chromatic/turbosnap-good.png){width=298 height=185}
:::

:no_entry_sign: Bad

:::align-image-left
![Turbosnap failed example](../static/chromatic/turbosnap-bad.png){width=302 height=273}
:::


### Conditionally run Chromatic using a pull request label

Avoid triggering the Chromatic workflow automatically in your CI. Instead, run it manually after the pull request has been reviewed and is ready to merge by adding a [label](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels#creating-a-label).

### Create small, fast-merging PRs for changes that disable TurboSnap

Some changes can disable TurboSnap for a build. It's often the case when a module referenced by `./storybook/preview.ts[x]` file is updated or when package dependencies are added/updated/removed.

These changes include:

- Updating React providers in the application (`Provider.tsx`)
- Updating centralized localization files (`**/resources.json`)
- Updating environment variables
- Updating large constants files
- Updating package dependencies (`**/package.json`)

We recommend **splitting** centralized or large **files** whenever possible. When this is not feasible, make changes in small, focused PRs and **merge** them **as quickly as possible**.

You can **identify** builds where **TurboSnap** is **disabled** by navigating to the build's details and looking for the _"TurboSnap"_ **ribbon** on the **right**. For instance, Chromatic may indicate that a _"full build"_ was triggered due to a change in the `.storybook/preview.ts[x]` file, possibly because React providers were updated, localized resources were modified, etc.

:::align-image-left
![](../static/chromatic/turbosnap-bad.png){width=302 height=273}
:::

If you believe that updates to certain large files, you can play with the [untraced](https://www.chromatic.com/docs/configure/#untraced) setting of your project's `chromatic.config.json` file to tell chromatic to ignore some of these files:

```json chromatic.config.json
{
    "$schema": "https://www.chromatic.com/config-file.schema.json",
    "untraced": ["**/package.json"]
}
```

### Avoid importing modules from barrel files

Barrel files (`**/index.ts[x]`) are often problematic and should generally be avoided. This is particularly important when working with chromatic. If a barrel file is referenced in the `.storybook/preview.ts[x]` file and any module exported by that barrel file is updated, **TurboSnap** will be **disabled**, and a _"full build"_ will be triggered.

### Only capture snapshots for Chrome

Chromatic can capture snapshots across [multiple browsers](https://www.chromatic.com/docs/browsers/), which can be useful but also expensive because it multiplies the number of snapshots captured by the number of browsers enabled.

For example, if both Chrome and Safari are enabled, **2 snapshots** (or TurboSnaps) will be captured for every story.

### Avoid using Chromatic locally with Storybook

Storybook allows running visual tests locally, but this is costly as it triggers the entire suite of visual tests.

Please do not use this feature. Only run visual tests from a PR.

### Avoid large constants or utils files

Large files referenced by the `.storybook/preview.ts[x]` file will **disable TurboSnap** and trigger a _"full build"_. Large files that are imported by multiple files can also cause a **domino effect**, resulting in many additional snapshots rather than TurboSnaps.

Examples of such files:

- Localization files
- Environment variables
- Routes
- Backend constants
- Dates utils
- Formatting utils

As a general rule, avoid referencing large files with multiple unrelated exports. Instead, aim for smaller and more focused files.

If you believe that updates to certain large files should not refresh the snapshot baseline, add them to the [untraced](https://www.chromatic.com/docs/configure/#untraced) setting of your project's `chromatic.config.json` file.

## Recommendations

### Use a modular architecture

By combining a modular monolith architecture with tools like [Turborepo](https://turborepo.dev/), local development tools and CI pipelines can be configured to run only for the modules affected by a change. This significantly improves performance and reduces the feedback loop for developers.

When applied to Chromatic, this strategy can drastically reduce costs. Even though TurboSnaps reduce snapshot usage, they still have a cost. Skipping Chromatic entirely for modules that are not affected by a change is more efficient than relying on TurboSnaps alone.

:link: [Proof of concept](https://github.com/patricklafrance/sg-next-architecture)

## Optimizations

### Ignore PRs from the Renovate bot

Although minor or patch updates to dependencies could introduce regressions, we usually prefer to invest our snapshot budget in detecting regressions from changes we make directly to our codebases.

To configure your CLI to ignore PRs from the Renovate bot.

### Ignore package.json files

Changes to `package.json` files will **disable TurboSnap** and trigger a _"full build"_. While this can be useful if the updated package impacts the UI (e.g. Hopper), it is sometimes unnecessary.

If you believe that changes to the `package.json` files should not refresh the snapshot baseline, add the [untraced](https://www.chromatic.com/docs/configure/#untraced) setting to your project's `chromatic.config.json` file and instruct chromatic to ignore `package.json` files:

```json chromatic.config.json
{
    "$schema": "https://www.chromatic.com/config-file.schema.json",
    "untraced": ["**/package.json"]
}
```

