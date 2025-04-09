---
order: 70
label: Deploy to Netlify
meta:
    title: Deploy to Netlify - Rsbuild
toc:
    depth: 2-3
---

# Deploy to Netlify

The deployment process for web applications can vary depending on various factors. Therefore, we do not recommend any specific deployment setup.

However, there are a few essential configurations that need to be made regardless of your architectural and deployment choices.

## Set `assetPrefix` to `auto`

To easily support Netlify staging environments and [PR deploys](https://www.netlify.com/blog/how-to-integrate-azure-devops-with-netlify-cicd/), it's recommended to set the [assetPrefix](./configure-build.md#assetprefix) option in Rsbuild to `auto`.

## Add a default redirect 

For SPA, it's important to support direct URL access (e.g., when a user refreshes a page or navigates directly to a route). To handle this, a redirect rule that serves the `index.html` file instead of returning a `404` response must be configured.

First, create a `_redirects` file at the root of the project:

```_redirects
/* /index.html 200
```

Then, update the `build` script of the project to copy the `_redirects` file into the `dist` folder once the application is built:

```json package.json
{
    "scripts": {
        "build": "pnpm run --sequential \"/^build:.*/\"",
        "build:rsbuild": "rsbuild build --config ./rsbuild.build.ts",
        "build:copy-redirects": "copyfiles _redirects dist",
    }
}
```

Make sure to install the [copyfiles](https://www.npmjs.com/package/copyfiles) package as a dev dependency of the project:

+++ pnpm
```bash
pnpm add -D copyfiles
```
+++ yarn
```bash
yarn add -D copyfiles
```
+++ npm
```bash
npm install -D copyfiles
```
+++

!!!info
The official documentation for this strategy is available on the [Netlify website](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps).
!!!
