import type { Linter } from "eslint";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";
import type { ConfigWithExtends } from "./types.ts";

export interface JestConfigOptions {
    enabled?: boolean;
    rules?: Partial<Linter.RulesRecord>;
}

export const jestGlobalIgnores = [];

export function defineJestConfig(options: JestConfigOptions = {}) {
    const {
        enabled = false,
        rules = {}
    } = options;

    if (!enabled) {
        return [];
    }

    const config: ConfigWithExtends[] = [{
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
            "jest/no-commented-out-tests": "off",
            // Gives better failure messages for array checks.
            "jest/prefer-to-contain": "error",
            // Prefer spies to allow for automatic restoration.
            "jest/prefer-spy-on": "error",
            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
