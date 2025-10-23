import { defineConfig, globalIgnores } from "eslint/config";
import { coreConfig, type CoreConfigOptions, coreGlobalIgnores } from "../core.ts";
import { jsonConfig, JsonConfigOptions, jsonGlobalIgnores } from "../json.ts";
import { packageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { typescriptConfig, type TypescriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { yamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

export interface DefineMonorepoWorkspaceConfigOptions {
    core?: CoreConfigOptions;
    json?: JsonConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    typescript?: TypescriptConfigOptions;
    yaml?: YamlConfigOptions;
}

/**
 * @param tsconfigRootDir The directory of the tsconfig file to use for rules that needs a TypeScript type check: https://typescript-eslint.io/packages/parser/#tsconfigrootdir.
 * @param options An optional object of options for the ESlint core and plugins rules.
 */
export function defineMonorepoWorkspaceConfig(tsconfigRootDir: string, options: DefineMonorepoWorkspaceConfigOptions = {}) {
    const {
        core,
        json,
        packageJson,
        typescript,
        yaml
    } = options;

    return defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            ".turbo",
            ...coreGlobalIgnores,
            ...jsonGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        ...coreConfig(core),
        ...jsonConfig(json),
        ...packageJsonConfig(packageJson),
        ...typescriptConfig(tsconfigRootDir, typescript),
        ...yamlConfig(yaml),
        {
            rules: {
                "package-json/valid-version": "off"
            }
        }
    ]);
}
