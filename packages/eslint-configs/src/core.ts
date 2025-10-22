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

            // https://eslint.org/docs/rules
            // Extra eslint rules

            // Possible Problems
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
            "no-multi-str": "warn",
            "no-new-func": "warn",
            "no-new-object": "warn",
            "no-new-wrappers": "warn",
            "no-octal-escape": "warn",
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-constructor": "warn",
            "no-script-url": "warn",
            "no-sequences": "warn",
            "no-throw-literal": "warn",
            "prefer-const": "warn",
            "no-var": "warn",
            curly: "warn",
            "no-shadow": "warn",
            "no-restricted-properties": "warn",
            "no-unneeded-ternary": "warn",
            "no-param-reassign": "warn",
            eqeqeq: ["warn", "smart"],
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
            "no-restricted-syntax": ["error", "WithStatement"],
            "no-restricted-globals": ["error"],
            "no-useless-rename": [
                "warn",
                {
                    ignoreDestructuring: false,
                    ignoreImport: false,
                    ignoreExport: false
                }
            ],
            strict: ["warn", "never"],
            "no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true
                }
            ],

            // Layout & Formatting
            // "no-native-reassign": "warn", // deprecated replaced by no-global-assign, deja ds recommended
            // "no-negated-in-lhs": "warn", // deprecated replaced by no-unsafe-negation, deja ds recommended
            "padding-line-between-statements": [
                "warn",
                { blankLine: "always", prev: "*", next: "return" }
            ],

            "rest-spread-spacing": ["warn", "never"],
            "unicode-bom": ["warn", "never"],
            "comma-spacing": ["warn", { before: false, after: true }],
            "keyword-spacing": ["warn", { before: true, after: true }],
            "arrow-spacing": ["warn", { before: true, after: true }],
            "space-before-blocks": ["warn", "always"],
            "space-in-parens": ["warn", "never"],
            "padded-blocks": ["warn", "never"],
            "brace-style": ["warn", "1tbs", { allowSingleLine: true }],
            "new-parens": "warn",
            "no-whitespace-before-property": "warn",
            "no-multi-spaces": "warn",
            "no-multiple-empty-lines": "warn",
            "space-infix-ops": "warn",
            "max-len": ["warn", { tabWidth: 4, code: 300 }],
            indent: [
                "warn",
                4,
                {
                    SwitchCase: 1,
                    CallExpression: { arguments: "first" }
                }
            ],
            semi: ["warn", "always"],
            quotes: ["warn", "double"],
            "comma-dangle": ["warn", "never"],
            "object-curly-spacing": ["warn", "always"],
            "dot-location": ["warn", "property"],
            "arrow-parens": ["warn", "as-needed"],

            // https://github.com/import-js/eslint-plugin-import/tree/main/docs/rules
            "import/no-amd": "error",
            "import/no-webpack-loader-syntax": "error",
            "import/no-self-import": "error",
            "import/newline-after-import": "warn",
            "import/no-duplicates": "warn",

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
