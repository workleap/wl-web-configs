---
"@workleap/browserslist-config": major
---

Excluded Opera Mini, KaiOS, UC Browser and QQ Browser from the supported browsers. These browsers were pulled in by the `> 0.2%` global market share clause and forced consumers building with `polyfill: "usage"` to ship ~30 KB gzip of core-js polyfills that only exist for them.

This is a breaking change because these browsers are no longer supported by default. Projects that still need them can add them back in their `.browserslistrc`, for example with `op_mini all`.
