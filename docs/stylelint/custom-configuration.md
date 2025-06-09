---
order: 80
label: Custom configuration
meta:
    title: Custom configuration - Stylelint
---

# Custom configuration

If you are in the process of **migrating an existing project** to use `@workleap/stylelint-configs` or encountering a challenging situation that is not currently handled by this library, you might want to customize the default shared configurations.

!!!tip
For a list of the rules included with the default shared configurations, refer to the following [file](https://github.com/workleap/wl-web-configs/blob/main/packages/stylelint-config/src/index.ts) on GitHub.
!!!

## Disable a default rule

You can disable a default rule by defining the rule locally with the `null` value:

```json !#4-6 .stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "extends": "@workleap/stylelint-configs",
    "rules": {
        "color-hex-length": null
    }
}
```

## Change a default rule severity

You can update the severity of a rule by defining the rule locally with either the `"warn"` or `"error"` severity:

```json !#4-6 .stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "extends": "@workleap/stylelint-configs",
    "rules": {
        "max-nesting-depth": [2, { "severity": "error" }]
    }
}
```

## Change a default rule value

You can update a default rule value by defining the rule locally with its new value:

```json !#4-8 .stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "extends": "@workleap/stylelint-configs",
    "rules": {
        "unit-allowed-list": [
            "rem"
        ]
    }
}
```

## Add a plugin

You can configure additional rules from a third party [Stylelint plugin](https://stylelint.io/user-guide/configure#plugins):

```json !#3,5-10 .stylelintrc.json
{
    "$schema": "https://json.schemastore.org/stylelintrc",
    "plugins": ["stylelint-order"],
    "extends": "@workleap/stylelint-configs",
    "rules": {
		"order/properties-order": [
			"width",
			"height"
		]
    }
}
```


