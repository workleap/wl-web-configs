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
            tseslint.configs.stylisticTypeChecked
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                // Rely on TypeScript's project service to automatically discover the "tsconfig.json" file.
                projectService: true,
                tsconfigRootDir
            }
        },
        rules: {
            // @typescript-eslint/recommended disables
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends", allowObjectTypes: "never" }],

            // Additional rules we want
            "@typescript-eslint/consistent-type-definitions": "warn",
            "@typescript-eslint/explicit-member-accessibility": ["warn", { accessibility: "no-public" }],
            "@typescript-eslint/method-signature-style": "warn",
            "comma-dangle":"off",
            "no-dupe-class-members":"off",
            "@typescript-eslint/no-dupe-class-members":"error",
            "no-loop-func":"off",
            "@typescript-eslint/no-loop-func":"warn",
            "no-shadow":"off",
            "@typescript-eslint/no-shadow":"warn",
            "no-unused-expressions":"off",
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true
                }
            ],
            "no-use-before-define":"off",
            "no-useless-constructor":"off",
            "@typescript-eslint/no-useless-constructor":"warn",
            "object-curly-spacing":"off",
            "quotes":"off",
            "@stylistic/quotes": ["warn", "double"],
            "@typescript-eslint/no-import-type-side-effects": "warn",
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                {
                    "prefer": "type-imports",
                    "disallowTypeAnnotations": true,
                    "fixStyle": "inline-type-imports"
                }
            ],

            "@stylistic/member-delimiter-style": "warn",
            "@stylistic/comma-dangle": ["warn", "never"],
            "indent":"off",
            "@stylistic/indent": [
                "warn",
                4,
                {
                    SwitchCase: 1,
                    CallExpression: { arguments: "first" }
                }
            ],
            "@stylistic/object-curly-spacing": ["warn", "always"],
            "semi":"off",
            "@stylistic/semi": ["warn", "always"],

            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
