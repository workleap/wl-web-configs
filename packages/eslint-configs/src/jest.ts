import type { Linter } from "eslint";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";
import type { ConfigWithExtends } from "./types.ts";

export interface JestConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const jestGlobalIgnores = [];

export function jestConfig(options: JestConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    return [{
        name: "@workleap/eslint-configs/jest",
        files: [
            "**/*.test.{js,jsx,ts,tsx}",
            "**/*-test.{js,jsx,ts,tsx}",
            "**/__tests__/*.{js,jsx,ts,tsx}",
            "**/test.{js,jsx,ts,tsx}"
        ],
        extends: [
            jestPlugin.configs["flat/recommended"]
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2024,
                ...globals.node,
                ...globals.commonjs,
                ...globals.jest
            }
        },
        settings: {
            jest: {
                version: "detect"
            }
        },
        rules: {
            // Prefer spies to allow for automatic restoration.
            "jest/prefer-spy-on": "error",
            // Gives better failure messages for array checks.
            "jest/prefer-to-contain": "error",
            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }] satisfies ConfigWithExtends[];
};
