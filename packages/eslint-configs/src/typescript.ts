import js from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
import type { Linter } from "eslint";
import tseslint from "typescript-eslint";
import type { ConfigWithExtends } from "./types.ts";

export interface TypescriptConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const typescriptGlobalIgnores = [];

export function typescriptConfig(tsconfigRootDir: string, options: TypescriptConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/typescript",
        files: [
            "**/*.{ts,tsx}"
        ],
        plugins: {
            "@stylistic": stylisticPlugin
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.stylisticTypeCheckedOnly,
            stylisticPlugin.configs.recommended
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                // Rely on TypeScript's project service to automatically discover the "tsconfig.json" file
                // within the boundaries of "tsconfigRootDir".
                projectService: true,
                tsconfigRootDir
            }
        },
        rules: {
            // ESLint core rules overrides
            "dot-notation": "off",
            "indent": "off",
            "no-dupe-class-members": "off",
            "no-empty-function": "off",
            "no-loop-func": "off",
            "no-shadow": "off",
            "no-unused-expressions": "off",
            "no-use-before-define": "off",
            "no-useless-constructor": "off",
            "object-curly-spacing": "off",
            "quotes": "off",
            "semi": "off",

            // ESlint deprecated core rules
            "arrow-parens": "off",
            "comma-dangle": "off",

            // @typescript-eslint recommended rules overrides
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/no-base-to-string": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-object-type": [
                "error",
                {
                    allowInterfaces: "with-single-extends",
                    allowObjectTypes: "never"
                }
            ],
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/restrict-template-expressions": "off",

            // @stylistic recommend rules overrides
            "@stylistic/arrow-parens": [
                "warn",
                "as-needed",
                {
                    requireForBlockBody: false
                }
            ],
            "@stylistic/comma-dangle": ["warn", "never"],
            "@stylistic/indent": [
                "warn",
                4,
                {
                    SwitchCase: 1,
                    CallExpression: { arguments: "first" }
                }
            ],
            "@stylistic/brace-style": ["warn", "1tbs"],
            "@stylistic/member-delimiter-style": [
                "warn",
                {
                    multiline: {
                        delimiter: "semi"
                    },
                    singleline: {
                        delimiter: "semi"
                    }
                }
            ],
            "@stylistic/multiline-ternary": "off",
            "@stylistic/no-multiple-empty-lines": [
                "warn",
                {
                    // View https://eslint.style/rules/eol-last.
                    max: 1
                }
            ],
            // Should be the default but somehow it's not enforced if it's not explicitly specified.
            "@stylistic/quote-props": "off",
            "@stylistic/quotes": ["warn", "double"],
            "@stylistic/semi": ["warn", "always"],

            // Additional rules we want
            // "@typescript-eslint/consistent-type-definitions": "warn",
            // "@typescript-eslint/explicit-member-accessibility": ["warn", { accessibility: "no-public" }],
            // "@typescript-eslint/method-signature-style": "warn",
            // "@typescript-eslint/no-dupe-class-members": "error",
            // "@typescript-eslint/no-loop-func": "warn",
            // "@typescript-eslint/no-shadow": "warn",
            // "@typescript-eslint/no-unused-expressions": [
            //     "error",
            //     {
            //         allowShortCircuit: true,
            //         allowTernary: true,
            //         allowTaggedTemplates: true
            //     }
            // ],

            // "@typescript-eslint/no-useless-constructor": "warn",
            // "@typescript-eslint/no-import-type-side-effects": "warn",
            // "@typescript-eslint/consistent-type-imports": [
            //     "warn",
            //     {
            //         prefer: "type-imports",
            //         disallowTypeAnnotations: true,
            //         fixStyle: "inline-type-imports"
            //     }
            // ],

            // "@stylistic/object-curly-spacing": ["warn", "always"],

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
