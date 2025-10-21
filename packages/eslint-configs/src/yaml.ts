import type { Linter } from "eslint";
import yamlPlugin from "eslint-plugin-yaml";
import type { ConfigWithExtends } from "./types.ts";

export interface YamlConfigOptions {
    rules?: Partial<Linter.RulesRecord>;
}

export const yamlGlobalIgnores = [];

export function yamlConfig(options: YamlConfigOptions = {}) {
    const {
        rules = {}
    } = options;

    const config: ConfigWithExtends[] = [{
        name: "@workleap/eslint-configs/yaml",
        files: [
            "**/*.yaml",
            "**/*.yml"
        ],
        extends: [
            yamlPlugin.configs.recommended as Linter.Config
        ],
        rules
    }];

    return config;
};
