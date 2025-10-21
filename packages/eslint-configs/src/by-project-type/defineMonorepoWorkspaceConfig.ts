import { defineConfig, globalIgnores } from "eslint/config";
import { coreConfig, type CoreConfigOptions, coreGlobalIgnores } from "../core.ts";
import { packageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { typescriptConfig, type TypescriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { yamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

export interface DefineMonorepoWorkspaceConfigOptions {
    core?: CoreConfigOptions;
    typescript?: TypescriptConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    yaml?: YamlConfigOptions;
}

export function defineMonorepoWorkspaceConfig(options: DefineMonorepoWorkspaceConfigOptions = {}) {
    const {
        core,
        typescript,
        packageJson,
        yaml
    } = options;

    return defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            ...coreGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        coreConfig(core),
        typescriptConfig(typescript),
        packageJsonConfig(packageJson),
        yamlConfig(yaml),
        {
            rules: {
                "package-json/valid-version": "off"
            }
        }
    ]);
}
