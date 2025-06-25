---
order: 80
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

Finally, defines the specific validation steps for the workflow between `Restore Turborepo cache` and `Save Turborepo cache` sections and add a [branch rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#creating-a-branch-protection-rule) protecting your `main` branch.

### Try it :rocket:

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

## Azure Pipelines

To set up an [Azure Pipelines](https://azure.microsoft.com/en-us/products/devops/pipelines) CI workflow for a [Turborepo](https://turborepo.com/) project, first, create a [template file](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops&pivots=templates-includes) named `setup.yml`. Then, create a `ci.yml` file that includes this template and defines the specific validation steps for the workflow.

### setup.yml

To setup a template file, create `setup.yml` file inside the `.pipelines/templates` folder at the root of the solution's workspace

```bash !#4 .pipelines/templates/setup.yml
workspace
├── .pipelines
├──── templates
├────── setup.yml
├── package.json
```

Then, open the newly created file and copy/paste the following content:

```yaml !#8-12,14-17 .pipelines/templates/setup.yml
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

!!!tip
Update the [PNPM](https://pnpm.io/) version to match the one used in your repository.
!!!

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

Finally, edit the sections of the `ci.yml` file, setup the pipeline in [Azure DevOps](https://azure.microsoft.com/en-us/products/devops) and ensure the pipeline as a required [build validation](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops&tabs=browser#build-validation) for your `main` branch.
