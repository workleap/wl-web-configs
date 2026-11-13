# CLAUDE.md

`@workleap/*-configs` — shared web configuration packages for Workleap web applications. See [CONTRIBUTING.md](./CONTRIBUTING.md) for commands and workflows.

## Agent skills

- `packages/<package>/skills/` holds the skill bundled in that npm package and linked by pnpm into consumer projects. Every change under `packages/<package>/skills/` needs a `patch` changeset for that package, otherwise consumers never receive it. The CI fails a pull request that changes a package skill without adding one. Never add `[skip ci]` to a commit that changes a package skill: it skips that check and the release.
- `agent-skills/` holds the skills installed from the repository files with `skills.sh`, such as the best practices skills and the `workleap-web-configs` umbrella skill. They are not shipped in a package and need no changeset.
- A package skill and the matching reference file of the umbrella skill must stay consistent: the same configuration signatures, options and examples.

## GitHub Actions

Renovate merges its GitHub Actions updates into `main` without a pull request. See [CONTRIBUTING.md](./CONTRIBUTING.md#github-actions) for the setup and what it depends on.

- Never remove the `renovate/**` push trigger from `ci.yml`: Renovate never merges a branch that has no passing check.
- Pin every `uses:` to a commit hash with its release in a comment (`owner/repo@<sha> # vX.Y.Z`), never to a tag (`@v7`, `@latest`) or a branch. Never drop the version comment: Renovate ignores a hash that has none.
- Never move `anthropics/claude-code-action` back into the shared Renovate group, and never add a `schedule` to throttle it.
- Never replace the `automerge` settings of `renovate.json` with the organization's `all-automerge.json` preset, which leaves major updates out, and never add a branch protection on `main` that requires a pull request or an approval, which stops the auto-merge.
