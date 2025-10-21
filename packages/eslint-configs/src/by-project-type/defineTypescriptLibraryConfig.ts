import { defineConfig, globalIgnores } from "eslint/config";
import { coreConfig, type CoreConfigOptions, coreGlobalIgnores } from "../core.ts";
import { jestConfig, type JestConfigOptions, jestGlobalIgnores } from "../jest.ts";
import { packageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { typescriptConfig, type TypescriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { vitestConfig, type VitestConfigOptions, vitestGlobalIgnores } from "../vitest.ts";
import { yamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

//     rules: {
//         // Custom WorkLeap rules
//         "@workleap/strict-css-modules-names": "warn"
//     }

export interface DefineTypeScriptLibraryConfigOptions {
    core?: CoreConfigOptions;
    typescript?: TypescriptConfigOptions;
    jest?: JestConfigOptions;
    vitest?: VitestConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    yaml?: YamlConfigOptions;
}

export function defineTypeScriptLibraryConfig(options: DefineTypeScriptLibraryConfigOptions = {}) {
    const {
        core,
        typescript,
        jest,
        vitest,
        packageJson,
        yaml
    } = options;

    defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            ...coreGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...jestGlobalIgnores,
            ...vitestGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        coreConfig(core),
        typescriptConfig(typescript),
        jestConfig(jest),
        // Temporary fix until the vitest plugin support defineConfig and the types are fixed.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vitestConfig(vitest) as any),
        packageJsonConfig(packageJson),
        yamlConfig(yaml)
    ]);
}
