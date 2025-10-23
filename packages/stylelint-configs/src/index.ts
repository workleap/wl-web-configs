import type { Config } from "stylelint";

const config: Config = {
    // Emit errors for `stylelint-disable` comments that don't actually match any lints that need to be disabled.
    reportNeedlessDisables: true,
    // Emit errors for `stylelint-disable` comments that don't match rules that are specified in the configuration object.
    reportInvalidScopeDisables: true,
    extends: ["stylelint-config-standard"],
    plugins: ["stylelint-prettier"],
    defaultSeverity: "warning",
    rules: {
        // # Rule category: Avoid Errors

        // Override from the stylelint-config-recommended config.
        // We don"t use the "no-descending-specificity" rule because we don"t like the way it works.
        "no-descending-specificity": null,

        // Override from the stylelint-config-recommended config.
        // We use CSS Modules and it uses :global and :local pseudo classes.
        // This rule has been taken from https://github.com/pascalduez/stylelint-config-css-modules/blob/main/index.js
        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: [
                    "export",
                    "import",
                    "global",
                    "local",
                    "external"
                ]
            }
        ],

        // # Rule category: Enforce conventions

        // Override from the stylelint-config-standard config.
        // We prefer using the long hex format for colors.
        "color-hex-length": "long",

        // Override from the stylelint-config-standard config.
        // We use CSS Modules and the apps usually use camelCase since it can be used a a JavaScript variable name.
        // Ex: .myClass can be used as a JavaScript variable name (styles.myClass).
        // if we had used kebab-case (my-class) then we would have to use styles["my-class"] which is not as nice.
        // in our design system however, i would add the following rule:
        // "selector-class-pattern": [
        //      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
        //      {
        //          message: (selector) => `Expected class selector "${selector}" to be kebab-case`
        //      }
        //  ]
        "selector-class-pattern": null,

        // These next rules do not exist in the stylelint-config-recommended config nor the stylelint-config-standard config.
        // We are adding them here because we want to enforce them.
        "max-nesting-depth": 2,
        "declaration-block-single-line-max-declarations": 1,
        "font-weight-notation": "numeric",
        "unit-allowed-list": [
            "em",
            "rem",
            "%",
            "fr",
            "deg",
            "vh",
            "vw",
            "s",
            "ch"
            // px is not allowed because we use rem units instead.
        ],

        // As of Stylelint 15, all stylistic rules have been dropped. They suggest using Prettier instead.
        "prettier/prettier": true
    }
};

// Using TypeScript "export" keyword until StyleLint support ESM.
// Otherwise we must deal with a weird CommonJS output from esbuild which is not worth it.
// For more info, see: https://github.com/evanw/esbuild/issues/1079
export = config;
