---
order: 80
label: Setup a CI workflow with Turborepo
---

# Setup a CI workflow with Turborepo

## Create the workflow file

To set up a [GitHub Actions](https://github.com/features/actions) CI workflow for a [Turborepo](https://turborepo.com/) project, first, create a `ci.yml` file inside the `.github/workflows` folder at the root of the solution's workspace:

```bash !#4 .github/workflows/ci.yml
workspace
├── .github
├──── workflows
├────── ci.yml
├── package.json
```

Then, open the newly created file and copy/paste the following content:

```yaml !#27-28,46-54,58-63,67-72,76-81,85-90,97-102,104-110 .github/workflows/ci.yml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

env:
  CI: true

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          # Required for the Turborepo Git filters.
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: false

      - name: Install Node.js
        uses: actions/setup-node@v6
        with:
          node-version: ">=24.0.0"
          check-latest: true
          cache: pnpm
          cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Restore Turborepo cache
        id: cache-turborepo-restore
        uses: actions/cache/restore@v5
        with:
          key: ${{ runner.os }}-turbo-ci-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-ci-
            ${{ runner.os }}-turbo-
          path: .turbo

      - name: Build apps or packages
        # For a PR, only build the host if it's diverging from the pull request original baseline.
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
              pnpm turbo run build --filter={YOUR_FILTER}...[${{ github.event.pull_request.base.sha }}]
          else
              pnpm turbo run build --filter=YOUR_FILTER
          fi

      - name: ESLint
        # For a PR, only lint the projects that are diverging from the pull request original baseline.
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
              pnpm turbo run eslint --continue --filter=...[${{ github.event.pull_request.base.sha }}]
          else
              pnpm turbo run eslint --continue
          fi

      - name: Stylelint
        # For a PR, only lint the projects that are diverging from the pull request original baseline.
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
              pnpm turbo run stylelint --continue --filter=...[${{ github.event.pull_request.base.sha }}]
          else
              pnpm turbo run stylelint --continue
          fi

      - name: Typecheck
        # For a PR, only typecheck the projects that are diverging from the pull request original baseline.
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
              pnpm turbo run typecheck --continue --filter=...[${{ github.event.pull_request.base.sha }}]
          else
              pnpm turbo run typecheck --continue
          fi

      - name: Syncpack
        run: pnpm turbo run syncpack

      - name: Test packages
        # For a PR, only test the projects that are diverging from the pull request original baseline.
        run: |
            if [ "${{ github.event_name }}" == "pull_request" ]; then
                pnpm turbo run test --continue --force --filter=...[${{ github.event.pull_request.base.sha }}]
            else
                pnpm turbo run test --continue --force
            fi

      - name: Save Turborepo cache
        id: cache-turborepo-save
        if: always() && steps.cache-turborepo-restore.outputs.cache-hit != 'true'
        uses: actions/cache/save@v5
        with:
          key: ${{ steps.cache-turborepo-restore.outputs.cache-primary-key }}
          path: .turbo
```

Finally, defines the specific validation steps for the workflow between `Restore Turborepo cache` and `Save Turborepo cache` sections and add a [branch rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#creating-a-branch-protection-rule) protecting your `main` branch.

## Try it :rocket:

To test your new CI workflow:

1. Create a pull request in GitHub and confirm that the CI workflow **runs successfully**.
2. Make a trivial change to the code in the pull request branch, something that shouldn't affect the build output.
3. Push the change to trigger the CI workflow again.
4. Check the CI workflow logs, you should see a log entry indicating a Turborepo cache hit:

```bash !#2
Run actions/cache/restore@v4
Cache hit for: Linux-turborepo-284bb4311b5346b0e97e839c74dd0775e07da29c
Received 72468 of 72468 (100.0%), 2.7 MBs/sec
Cache Size: ~0 MB (72468 B)
/usr/bin/tar -xf /home/runner/work/_temp/40650809-db05-4c4f-9636-43238dc9a0de/cache.tzst -P -C /home/runner/work/wl-web-configs/wl-web-configs --use-compress-program unzstd
Cache restored successfully
Cache restored from key: Linux-turborepo-3c24700252991e8087eab6ddc8e75defab17dc2b
```
