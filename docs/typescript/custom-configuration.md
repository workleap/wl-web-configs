---
order: 80
label: Custom configuration
meta:
    title: Custom configuration - TypeScript
---

# Custom configuration

If you are in the process of **migrating an existing project** to use `@workleap/typescript-configs` or encountering a challenging situation that is not currently handled by this library, you might want to customize the default shared configurations.

!!!tip
For a list of the rules included with the default shared configurations, refer to the configuration files in the following [folder](https://github.com/workleap/wl-web-configs/tree/main/packages/typescript-configs) on GitHub.
!!!

## Change a default field value

You can update a default field value by defining the field locally with its new value:

```json !#4 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/web-application"],
    "compilerOptions": {
        "strict": false
    },
    "exclude": ["dist", "node_modules"]
}
```

## Non ESM projects

If you are **migrating** an existing project and prefer to wait before moving to ESM, add the following custom configurations to allow `import` statements without specifying a file extension:

```json !#4-5 tsconfig.json
{
    "extends": ["@workleap/typescript-configs/web-application"],
    "compilerOptions": {
        "moduleResolution": "Bundler",
        "module": "ESNext",
    },
    "exclude": ["dist", "node_modules"]
}
```

## Start from scratch

If your situation is so challenging that you must start a new configuration from scratch, refer to the [advanced composition](advanced-composition.md) page.
