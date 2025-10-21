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

/**
 * @param tsconfigRootDir The directory of the tsconfig file to use for rules that needs a TypeScript type check: https://typescript-eslint.io/packages/parser/#tsconfigrootdir.
 * @param options An optional object of options for the ESlint core and plugins rules.
 */
export function defineMonorepoWorkspaceConfig(tsconfigRootDir: string, options: DefineMonorepoWorkspaceConfigOptions = {}) {
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
        ...coreConfig(core),
        ...typescriptConfig(tsconfigRootDir, typescript),
        ...packageJsonConfig(packageJson),
        ...yamlConfig(yaml),
        {
            rules: {
                "package-json/valid-version": "off"
            }
        }
    ]);
}
