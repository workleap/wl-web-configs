import stylisticPlugin from "@stylistic/eslint-plugin";
import type { Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import type { ConfigWithExtends } from "./types.ts";

export interface ReactConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
    compiler?: boolean;
}

export const reactGlobalIgnores = [];

export function defineReactConfig(options: ReactConfigOptions = {}) {
    const {
        rules = {},
        compiler = false
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/react",
        files: [
            "**/*.{js,ts,jsx,tsx}"
        ],
        plugins: {
            "@stylistic": stylisticPlugin
        },
        extends: [
            reactPlugin.configs.flat.recommended,
            reactPlugin.configs.flat["jsx-runtime"],
            reactHooksPlugin.configs.flat.recommended
        ],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            // React recommend rules overrides
            "react/display-name": "off",
            "react/jsx-key": "off",
            "react/jsx-no-duplicate-props": [
                "warn",
                {
                    ignoreCase: true
                }
            ],
            "react/jsx-no-undef": [
                "warn",
                {
                    allowGlobals: true
                }
            ],
            "react/no-unescaped-entities": "off",
            "react/prop-types": "off",
            // "react/react-in-jsx-scope": "off",

            // React extra rules
            "react/button-has-type": "warn",
            "react/default-props-match-prop-types": "warn",
            "react/destructuring-assignment": [
                "warn",
                "always",
                { ignoreClassFields: true }
            ],
            "react/forbid-foreign-prop-types": [
                "warn",
                {
                    allowInPropTypes: true
                }
            ],
            "react/jsx-boolean-value": ["warn", "never"],
            "react/jsx-filename-extension": [
                "warn",
                {
                    extensions: [".jsx", ".tsx"]
                }
            ],
            "react/jsx-pascal-case": [
                "warn",
                {
                    allowAllCaps: true,
                    ignore: []
                }
            ],
            "react/no-access-state-in-setstate": "warn",
            "react/no-array-index-key": "warn",
            "react/no-typos": "error",
            "react/no-unused-prop-types": [
                "warn",
                {
                    customValidators: [],
                    skipShapeProps: true
                }
            ],
            "react/no-unused-state": "warn",
            "react/style-prop-object": "warn",

            // React rules turned off in favor of @stylistic
            "react/jsx-closing-bracket-location": "off",
            "react/jsx-closing-tag-location": "off",
            "react/jsx-curly-brace-presence": "off",
            "react/jsx-curly-newline": "off",
            "react/jsx-curly-spacing": "off",
            "react/jsx-equals-spacing": "off",
            "react/jsx-first-prop-new-line": "off",
            "react/jsx-indent-props": "off",
            "react/jsx-max-props-per-line": "off",
            "react/jsx-one-expression-per-line": "off",
            "react/jsx-tag-spacing": "off",
            "react/jsx-wrap-multilines": "off",

            // React hooks recommend rules overrides
            "react-hooks/set-state-in-effect": "off",

            // React hooks "compiler" related rules
            ...compiler === false ? {
                "react-hooks/gating": "off",
                "react-hooks/incompatible-library": "off",
                "react-hooks/preserve-manual-memoization": "off",
                "react-hooks/unsupported-syntax": "off"
            } : {},

            // @stylistic rules (cannot use the recommended config" because it would conflict with the "typescript" config rules)
            "@stylistic/jsx-closing-bracket-location": "warn",
            "@stylistic/jsx-closing-tag-location": "warn",
            "@stylistic/jsx-curly-brace-presence": [
                "warn",
                {
                    propElementValues: "always"
                }
            ],
            "@stylistic/jsx-curly-newline": "warn",
            "@stylistic/jsx-curly-spacing": [
                "warn",
                {
                    children: true,
                    when: "never"
                }
            ],
            "@stylistic/jsx-equals-spacing": "warn",
            "@stylistic/jsx-first-prop-new-line": "warn",
            "@stylistic/jsx-function-call-newline": ["warn", "multiline"],
            "@stylistic/jsx-max-props-per-line": [
                "warn",
                {
                    maximum: 1,
                    when: "multiline"
                }
            ],
            "@stylistic/jsx-quotes": ["warn", "prefer-double"],
            "@stylistic/jsx-tag-spacing": [
                "warn",
                {
                    beforeSelfClosing: "always"
                }
            ],
            "@stylistic/jsx-wrap-multilines": [
                "warn",
                {
                    arrow: "parens-new-line",
                    assignment: "parens-new-line",
                    condition: "parens-new-line",
                    declaration: "parens-new-line",
                    logical: "parens-new-line",
                    prop: "parens-new-line",
                    propertyValue: "parens-new-line",
                    return: "parens-new-line"
                }
            ],

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
