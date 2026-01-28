import vitestPlugin from "@vitest/eslint-plugin";
import type { Linter } from "eslint";
import type { ConfigWithExtends } from "./types.ts";

export interface VitestConfigOptions {
    enabled?: boolean;
    rules?: Partial<Linter.RulesRecord>;
}

export const vitestGlobalIgnores = [];

export function defineVitestConfig(options: VitestConfigOptions = {}) {
    const {
        enabled = true,
        rules = {}
    } = options;

    if (!enabled) {
        return [];
    }

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/vitest",
        files: [
            "**/*.test.{js,jsx,ts,tsx}",
            "**/*-test.{js,jsx,ts,tsx}",
            "**/__tests__/*.{js,jsx,ts,tsx}",
            "**/test.{js,jsx,ts,tsx}"
        ],
        plugins: {
            vitest: vitestPlugin
        },
        // Waiting for defineConfig support: https://github.com/vitest-dev/eslint-plugin-vitest/issues/771
        // extends: [
        //     vitestPlugin.configs.recommended
        // ],
        rules: {
            ...vitestPlugin.configs.recommended.rules,
            "vitest/no-commented-out-tests": "off",
            "vitest/no-focused-tests": "warn",
            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
};
