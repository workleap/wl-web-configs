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

To do so, add `_redirects` file to the `public` folder of the project:

``` public/_redirects
/* /index.html 200
```

At build time, Rspack will automatically copy the `_redirects` file into the `dist` folder.

!!!info
The official documentation for this strategy is available on the [Netlify website](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps).
!!!
