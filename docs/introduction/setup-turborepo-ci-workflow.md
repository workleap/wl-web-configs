---
order: 90
label: Setup a CI workflow with Turborepo
---

# Setup a CI workflow with Turborepo

## GitHub Actions

To set up a [GitHub Actions](https://github.com/features/actions) CI workflow for a [Turborepo](https://turborepo.com/) project, first, create a `ci.yml` file inside the `.github/workflows` folder at the root of the solution's workspace:

```bash !#4 .github/workflows/ci.yml
workspace
├── .github
├──── workflows
├────── ci.yml
├── package.json
```

Then, open the newly created file and copy/paste the following content:

```yaml !#51-58 .github/workflows/ci.yml
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
            node-version: ">=22.0.0"
            check-latest: true
            cache: pnpm
            cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Restore Turborepo cache
        id: cache-turborepo-restore
        uses: actions/cache/restore@v4
        with:
          key: ${{ runner.os }}-turborepo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turborepo-
          path: .turbo

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: Test
        run: pnpm test

      - name: Save Turborepo cache
        id: cache-turborepo-save
        if: always() && steps.cache-turborepo-restore.outputs.cache-hit != 'true'
        uses: actions/cache/save@v4
        with:
          key: ${{ steps.cache-turborepo-restore.outputs.cache-primary-key }}
          path: .turbo

```

Finally, edit any of the sections between `Restore Turborepo cache` and `Save Turborepo cache`.

## Azure Pipelines

### setup.yml

To set up a [Azure Pipelines](https://azure.microsoft.com/en-us/products/devops/pipelines) CI workflow for a [Turborepo](https://turborepo.com/) project, first, create a `setup.yml` file inside the `.pipelines/templates` folder at the root of the solution's workspace:

```bash !#4 .pipelines/templates/setup.yml
workspace
├── .pipelines
├──── templates
├────── setup.yml
├── package.json
```

Then, open the newly created file and copy/paste the following content:

```yaml .pipelines/templates/setup.yml
steps:
  - task: UseNode@1
    displayName: Use Node.js 22
    inputs:
      version: 22
      checkLatest: true

  - task: Cache@2
    displayName: Cache turbo
    inputs:
      key: '"turbo" | "$(Agent.OS)" | turbo.json'
      path: $(Pipeline.Workspace)/.turbo-cache

  - script: |
      echo "##vso[task.setvariable variable=TURBO_TELEMETRY_DISABLED;]1"
      echo "##vso[task.setvariable variable=TURBO_CACHE_DIR;]$(Pipeline.Workspace)/.turbo-cache"
    displayName: Setup turbo

  - task: Cache@2
    inputs:
      key: 'pnpm | "$(Agent.OS)" | pnpm-lock.yaml'
      path: $(Pipeline.Workspace)/.pnpm-store
    displayName: Cache pnpm

  - script: |
      npm install -g pnpm@latest-9
      pnpm config set store-dir $(Pipeline.Workspace)/.pnpm-store
    displayName: Setup pnpm

  - script: pnpm install --frozen-lockfile
    displayName: pnpm install
```

### ci.yml

Then, create a `ci.yml` file inside the `.pipelines` folder at the root of the solution's workspace:

```yaml .pipelines/ci.yml
trigger: none

steps:
- template: templates/setup.yml

- script: pnpm lint
  displayName: pnpm lint

- script: pnpm build
  displayName: pnpm build

- script: pnpm test
  displayName: pnpm test
```

Finally, edit the sections of the `ci.yml` file and setup the pipeline in [Azure DevOps](https://azure.microsoft.com/en-us/products/devops).
