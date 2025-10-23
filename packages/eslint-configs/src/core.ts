import js from "@eslint/js";
import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import type { ConfigWithExtends } from "./types.ts";

export interface CoreConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const coreGlobalIgnores = [];

export function coreConfig(options: CoreConfigOptions = {}) {
    const {
        rules
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/core",
        files: [
            "**/*.{js,jsx,ts,tsx,cjs,mjs}"
        ],
        plugins: {
            js,
            import: importPlugin
        },
        extends: [
            js.configs.recommended
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2024,
                ...globals.node,
                ...globals.commonjs
            }
        },
        rules: {
            // Recommended rules overrides
            "no-cond-assign": ["error", "except-parens"],
            "no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
            "no-prototype-builtins": "off",

            // Possible problems
            "array-callback-return": "error",
            "no-self-compare": "error",
            "no-template-curly-in-string": "error",
            "no-use-before-define": [
                "error",
                {
                    functions: false,
                    classes: false,
                    variables: false
                }
            ],

            // Suggestions
            curly: "warn",
            eqeqeq: ["warn", "smart"],
            "no-array-constructor": "warn",
            "no-caller": "warn",
            "no-eval": "warn",
            "no-extend-native": "warn",
            "no-extra-bind": "warn",
            "no-extra-label": "warn",
            "no-implied-eval": "warn",
            "no-iterator": "warn",
            "no-label-var": "warn",
            "no-lone-blocks": "warn",
            "no-loop-func": "warn",
            "no-mixed-operators": [
                "warn",
                {
                    groups: [
                        ["&", "|", "^", "~", "<<", ">>", ">>>"],
                        ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                        ["&&", "||"],
                        ["in", "instanceof"]
                    ],
                    allowSamePrecedence: false
                }
            ],
            "no-multi-str": "warn",
            "no-new-func": "warn",
            "no-new-object": "warn",
            "no-new-wrappers": "warn",
            "no-octal-escape": "warn",
            "no-param-reassign": "warn",
            "no-restricted-properties": "warn",
            "no-restricted-globals": ["error"],
            "no-restricted-syntax": ["error", "WithStatement"],
            "no-script-url": "warn",
            "no-sequences": "warn",
            "no-shadow": "warn",
            "no-throw-literal": "warn",
            "no-unneeded-ternary": "warn",
            "no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true
                }
            ],
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-constructor": "warn",
            "no-useless-rename": [
                "warn",
                {
                    ignoreDestructuring: false,
                    ignoreImport: false,
                    ignoreExport: false
                }
            ],
            "no-var": "warn",
            "prefer-const": "warn",
            strict: ["warn", "never"],

            // Layout & Formatting
            "unicode-bom": ["warn", "never"],

            // https://github.com/import-js/eslint-plugin-import/tree/main/docs/rules
            "import/newline-after-import": "warn",
            "import/no-amd": "error",
            "import/no-duplicates": "warn",
            "import/no-self-import": "error",
            "import/no-webpack-loader-syntax": "error",

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
