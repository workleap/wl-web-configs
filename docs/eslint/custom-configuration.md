---
order: 80
meta:
    title: Custom configuration - ESLint
---

!!!warning
This package is compatible only with ESLint v8. It is not intended for use with ESLint v9 or later.
!!!

# Custom configuration

If you are in the process of **migrating an existing project** to use `@workleap/eslint-plugin` or encountering a challenging situation that is not currently handled by this library, you might want to customize the default shared configurations.

!!!tip
For a list of the rules included with the default shared configurations, refer to the configuration files in the following [folder](https://github.com/workleap/wl-web-configs/tree/main/packages/eslint-plugin/lib/config) on GitHub.
!!!

## Disable a default rule

You can disable a default rule by defining the rule locally with the `"off"` value:

```json !#5-7 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/web-application",
    "rules": {
        "no-var": "off"
    }
}
```

## Change a default rule severity

You can update the severity of a rule by defining the rule locally with either the `"warn"` or `"error"` severity:

```json !#5-7 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/web-application",
    "rules": {
        "jsx-a11y/alt-text": "error"
    }
}
```

## Change a default rule value

You can update a default rule value by defining the rule locally with its new value:

```json !#5-7 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "extends": "plugin:@workleap/web-application",
    "rules": {
        "quotes": ["warn", "single"]
    }
}
```

!!!info
Please, don't update your project configuration to use single quotes :sweat_smile::pray:
!!!

## Add a plugin

You can add configure additional rules from a third party [ESLint plugin](https://eslint.org/docs/latest/use/configure/plugins):

```json !#4,6-8 .eslintrc.json
{
    "$schema": "https://json.schemastore.org/eslintrc",
    "root": true,
    "plugins": ["unicorn"],
    "extends": "plugin:@workleap/web-application",
    "rules": {
        "unicorn/better-regex": "error"
    }
}
```

## Start from scratch

If your situation is so challenging that you must start a new configuration from scratch, refer to the [advanced composition](advanced-composition.md) page.
