import type { Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import type { ConfigWithExtends } from "./types.ts";

export interface ReactConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const reactGlobalIgnores = [];

export function reactConfig(options: ReactConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/react",
        files: [
            "**/*.[jt]sx"
        ],
        extends: [
            reactPlugin.configs.flat.recommended,
            // @ts-expect-error the types are broken and think there's a ".default" to add.
            reactHooksPlugin.configs.flat["recommended-latest"]
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
            // https://eslint.org/docs/rules
            "jsx-quotes": ["warn", "prefer-double"],

            // react/recommended overrides
            "react/jsx-no-duplicate-props": ["warn", { ignoreCase: true }],
            "react/jsx-no-undef": ["warn", { allowGlobals: true }],

            // react/recommended disables
            "react/react-in-jsx-scope": "off",
            "react/display-name": "off",
            "react/no-unescaped-entities": "off",
            "react/prop-types": "off",
            "react/jsx-key": "off",

            // extra react rules
            "react/forbid-foreign-prop-types": ["warn", { allowInPropTypes: true }],
            "react/jsx-pascal-case": [
                "warn",
                {
                    allowAllCaps: true,
                    ignore: []
                }
            ],
            "react/no-typos": "error",
            "react/style-prop-object": "warn",
            "react/button-has-type": "warn",
            "react/destructuring-assignment": [
                "warn",
                "always",
                { ignoreClassFields: true }
            ],
            "react/jsx-boolean-value": ["warn", "never"],
            "react/default-props-match-prop-types": "warn",
            "react/no-unused-state": "warn",
            "react/no-array-index-key": "warn",
            "react/no-access-state-in-setstate": "warn",
            "react/jsx-filename-extension": ["warn", { "extensions": [".jsx", ".tsx"] }],
            "react/jsx-curly-brace-presence": "warn",
            "react/no-unused-prop-types": [
                "warn",
                { customValidators: [], skipShapeProps: true }
            ],

            "react/jsx-closing-bracket-location": [1, "line-aligned"],
            "react/jsx-tag-spacing": ["warn", { beforeSelfClosing: "always" }],
            "react/jsx-max-props-per-line": [
                "warn",
                { maximum: 1, when: "multiline" }
            ],
            "react/jsx-curly-spacing": ["warn", { children: true, when: "never" }],

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
