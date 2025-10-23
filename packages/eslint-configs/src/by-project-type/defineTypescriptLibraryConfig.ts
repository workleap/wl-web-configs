import { defineConfig, globalIgnores } from "eslint/config";
import { coreConfig, type CoreConfigOptions, coreGlobalIgnores } from "../core.ts";
import { jestConfig, type JestConfigOptions, jestGlobalIgnores } from "../jest.ts";
import { jsonConfig, JsonConfigOptions, jsonGlobalIgnores } from "../json.ts";
import { packageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { WorkleapPlugin } from "../plugins/workleapPlugin.ts";
import { typescriptConfig, type TypescriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { vitestConfig, type VitestConfigOptions, vitestGlobalIgnores } from "../vitest.ts";
import { yamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

export interface DefineTypeScriptLibraryConfigOptions {
    core?: CoreConfigOptions;
    typescript?: TypescriptConfigOptions;
    jest?: JestConfigOptions;
    json?: JsonConfigOptions;
    vitest?: VitestConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    yaml?: YamlConfigOptions;
}

/**
 * @param tsconfigRootDir The directory of the tsconfig file to use for rules that needs a TypeScript type check: https://typescript-eslint.io/packages/parser/#tsconfigrootdir.
 * @param options An optional object of options for the ESlint core and plugins rules.
 */
export function defineTypeScriptLibraryConfig(tsconfigRootDir: string, options: DefineTypeScriptLibraryConfigOptions = {}) {
    const {
        core,
        jest,
        json,
        packageJson,
        typescript,
        vitest,
        yaml
    } = options;

    return defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            "**/__snapshots__/*",
            ...coreGlobalIgnores,
            ...jestGlobalIgnores,
            ...jsonGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...vitestGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        ...coreConfig(core),
        ...jestConfig(jest),
        ...jsonConfig(json),
        ...packageJsonConfig(packageJson),
        ...typescriptConfig(tsconfigRootDir, typescript),
        // Temporary fix until the vitest plugin support defineConfig and the types are fixed.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(vitestConfig(vitest) as any),
        ...yamlConfig(yaml),
        {
            plugins: {
                "@workleap": WorkleapPlugin
            },
            rules: {
                "@workleap/strict-css-modules-names": "warn"
            }
        }
    ]);
}
