# CLAUDE.md

`@workleap/*-configs` — shared web configuration packages for Workleap web applications. See [CONTRIBUTING.md](./CONTRIBUTING.md) for commands and workflows.

## Agent skills

- `packages/<package>/skills/` holds the skill bundled in that npm package and linked by pnpm into consumer projects. Every change under `packages/<package>/skills/` needs a `patch` changeset for that package, otherwise consumers never receive it. The CI fails a pull request that changes a package skill without adding one. Never add `[skip ci]` to a commit that changes a package skill: it skips that check and the release.
- `agent-skills/` holds the skills installed from the repository files with `skills.sh`, such as the best practices skills and the `workleap-web-configs` umbrella skill. They are not shipped in a package and need no changeset.
- A package skill and the matching reference file of the umbrella skill must stay consistent: the same configuration signatures, options and examples.
