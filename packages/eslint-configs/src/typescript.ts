import js from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
import type { Linter } from "eslint";
import tseslint from "typescript-eslint";
import type { ConfigWithExtends } from "./types.ts";

export interface TypeScriptConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const typescriptGlobalIgnores = [];

export function defineTypeScriptConfig(tsconfigRootDir: string, options: TypeScriptConfigOptions = {}) {
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
            stylisticPlugin.configs.customize({
                braceStyle: "1tbs",
                commaDangle: "never",
                jsx: false,
                quotes: "double",
                semi: true,
                severity: "warn"
            })
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
            "@typescript-eslint/no-floating-promises": "off",
            // This rule should be enabled but has several options that need to be investigated.
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/only-throw-error": "off",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            // This rule should be enabled but it's strangely causing issues with common React Aria patterns
            // when destructuring an object literal returned by a hook like "useFilter".
            "@typescript-eslint/unbound-method": "off",

            // @stylistic recommend rules overrides
            "@stylistic/arrow-parens": [
                "warn",
                "as-needed",
                {
                    requireForBlockBody: false
                }
            ],
            "@stylistic/indent": [
                "warn",
                4,
                {
                    SwitchCase: 1,
                    CallExpression: { arguments: "first" }
                }
            ],
            "@stylistic/indent-binary-ops": ["warn", 4],
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
            "@stylistic/no-mixed-operators": [
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
            "@stylistic/no-multiple-empty-lines": [
                "warn",
                {
                    // View https://eslint.style/rules/eol-last.
                    max: 1
                }
            ],
            "@stylistic/operator-linebreak": "off",
            "@stylistic/space-before-function-paren": [
                "warn",
                {
                    anonymous: "never",
                    named: "never",
                    asyncArrow: "always",
                    catch: "always"
                }
            ],
            "@stylistic/spaced-comment": "off",
            // Should be the default but somehow it's not enforced if it's not explicitly specified.
            "@stylistic/quote-props": "off",

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
