import type { Linter } from "eslint";
import jsoncPlugin from "eslint-plugin-jsonc";
import type { ConfigWithExtends } from "./types.ts";

export interface JsonConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const jsonGlobalIgnores = [];

export function defineJsonConfig(options: JsonConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/json",
        files: [
            "**/*.{json,jsonc}"
        ],
        extends: [
            jsoncPlugin.configs["flat/base"]
        ],
        rules: {
            "jsonc/indent": ["warn", 4],
            // Positioned last to allow the consumer to override any rules.
            ...rules
        }
    }];

    return config;
}
