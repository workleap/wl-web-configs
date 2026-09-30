---
"@workleap/browserslist-config": minor
---

Excluded Opera Mini, KaiOS, UC Browser and QQ Browser from the supported browsers. These browsers were pulled in by the `> 0.2%` global market share clause and forced consumers building with `polyfill: "usage"` to ship ~30 KB gzip of core-js polyfills that only exist for them.
