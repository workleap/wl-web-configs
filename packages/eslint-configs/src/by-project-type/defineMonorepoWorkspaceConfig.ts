import { defineConfig, globalIgnores } from "eslint/config";
import { type CoreConfigOptions, coreGlobalIgnores, defineCoreConfig } from "../core.ts";
import { defineJsonConfig, JsonConfigOptions, jsonGlobalIgnores } from "../json.ts";
import { definePackageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { defineTypeScriptConfig, type TypeScriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { defineYamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

export interface DefineMonorepoWorkspaceConfigOptions {
    core?: CoreConfigOptions;
    json?: JsonConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    typescript?: TypeScriptConfigOptions;
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
            ".playwright",
            ".turbo",
            ...coreGlobalIgnores,
            ...jsonGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        ...defineCoreConfig(core),
        ...defineJsonConfig(json),
        ...definePackageJsonConfig(packageJson),
        ...defineTypeScriptConfig(tsconfigRootDir, typescript),
        ...defineYamlConfig(yaml),
        {
            rules: {
                "package-json/valid-version": "off"
            }
        }
    ]);
}
