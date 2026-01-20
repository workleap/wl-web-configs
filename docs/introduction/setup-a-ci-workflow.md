---
order: 90
label: Setup a CI workflow
---

# Setup a CI workflow

To set up a [GitHub Actions](https://github.com/features/actions) CI workflow for a project, first, create a `ci.yml` file inside the `.github/workflows` folder at the root of the solution's workspace:

```bash !#4 .github/workflows/ci.yml
workspace
├── .github
├──── workflows
├────── ci.yml
├── package.json
```

Then, open the newly created file and copy/paste the following content:

```yaml !#42-49,60-66 .github/workflows/ci.yml
name: CI

# PNPM setup based on https://github.com/pnpm/action-setup#use-cache-to-reduce-installation-time

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

env:
  CI: true

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: false

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
            node-version: ">=24.0.0"
            check-latest: true
            cache: pnpm
            cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build apps or packages
        run: pnpm build

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test
```

Finally, defines the specific validation steps for the workflow and add a [branch rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#creating-a-branch-protection-rule) protecting your `main` branch.
