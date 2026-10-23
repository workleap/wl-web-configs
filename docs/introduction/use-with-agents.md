---
order: 70
label: Use with agents
toc:
    depth: 2-3
---

# Use with agents

Information about Web Configs libraries can be shared with different agents using [agent skills](https://skills.sh/).

## Install agent skills

A few skills are available for this library:

| Name | Description |
| --- | --- |
| [workleap-web-configs](https://skills.sh/workleap/wl-web-configs/workleap-web-configs) | An agent skill that helps developers understand, set up, and customize Workleap's shared web tooling configurations. |
| [workleap-chromatic-best-practices](https://skills.sh/workleap/wl-web-configs/workleap-chromatic-best-practices) | An agent skill that guides developers on applying Workleap's documented Chromatic best practices. |
| [workleap-react-best-practices](https://skills.sh/workleap/wl-web-configs/workleap-react-best-practices) | An agent skill that guides developers in applying Workleap’s documented React best practices. It is inspired by [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices), but adapted for a SPA that does not rely on the Vercel ecosystem. |

Open a terminal and install the agent skills by running the following commands:

+++ workleap-web-configs
```bash
pnpx skills add https://github.com/workleap/wl-web-configs --skill workleap-web-configs
```
+++ workleap-chromatic-best-practices
```bash
pnpx skills add https://github.com/workleap/wl-web-configs --skill workleap-chromatic-best-practices
```
+++ workleap-react-best-practices
```bash
pnpx skills add https://github.com/workleap/wl-web-configs --skill workleap-react-best-practices
```
+++

!!!tip
At installation, the `skills.sh` CLI will prompt you to choose whether to install the skill globally or within a project. We recommend installing it **locally** so it is available for code review tools such as [Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) or [Claude Code](https://github.com/anthropics/claude-code-action).
!!!

## Use the skills bundled with the packages

Starting with [PNPM](https://pnpm.io/agent-skills) `12.11`, packages can ship agent skills. Each active Web Configs package bundles a skill covering that package only, versioned and released with the package itself:

| Package | Skill |
| --- | --- |
| `@workleap/browserslist-config` | `workleap-browserslist-config` |
| `@workleap/eslint-configs` | `workleap-eslint-configs` |
| `@workleap/rsbuild-configs` | `workleap-rsbuild-configs` |
| `@workleap/rslib-configs` | `workleap-rslib-configs` |
| `@workleap/stylelint-configs` | `workleap-stylelint-configs` |
| `@workleap/typescript-configs` | `workleap-typescript-configs` |

PNPM never links a package's skills without approval. After installing the packages, PNPM lists the skills awaiting approval. Open a terminal at the root of the project and approve them by running the following command:

```bash
pnpm approve
```

The approvals are saved under the `permissions` setting of the `pnpm-workspace.yaml` file. They can also be added manually:

```yaml pnpm-workspace.yaml
permissions:
  "@workleap/eslint-configs":
    skills: true
  "@workleap/typescript-configs":
    skills: true
```

On the next install, PNPM links the approved skills into the agent skills folders that already exist at the root of the workspace, such as `.claude/skills`, `.cursor/skills`, `.agents/skills` or `.github/skills`, under names like `pnpm-@workleap+eslint-configs-workleap-eslint-configs`. The links are ignored by Git and are updated whenever the packages are updated. Use the [skills.dirs](https://pnpm.io/agent-skills) setting to choose the folders explicitly.

!!!warning
Install either the `workleap-web-configs` skill from `skills.sh` **or** the skills bundled with the packages, not both, as they cover the same content.
!!!

!!!info
PNPM only links the skills of a project's **direct** dependencies. When several projects of a workspace depend on different versions of a package, the skill of the highest version is linked.
!!!

## Try it :rocket:

Once the skills are installed, start an agent and ask it to set up a new project or audit an existing Chromatic setup:

```
I'm creating a new React + TypeScript web application from scratch. Set up the project to use Workleap shared configs for ESLint, TypeScript and Rsbuild.
```

```
Audit the Chromatic setup in my project and propose improvements based on Workleap's Chromatic best practices.
```
