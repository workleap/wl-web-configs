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

## Try it :rocket:

Once the skills are installed, start an agent and ask it to set up a new project or audit an existing Chromatic setup:

```
I'm creating a new React + TypeScript web application from scratch. Set up the project to use Workleap shared configs for ESLint, TypeScript and Rsbuild.
```

```
Audit the Chromatic setup in my project and propose improvements based on Workleap's Chromatic best practices.
```
