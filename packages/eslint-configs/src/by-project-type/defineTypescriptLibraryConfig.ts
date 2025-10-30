import { defineConfig, globalIgnores } from "eslint/config";
import { type CoreConfigOptions, coreGlobalIgnores, defineCoreConfig } from "../core.ts";
import { defineJestConfig, type JestConfigOptions, jestGlobalIgnores } from "../jest.ts";
import { defineJsonConfig, JsonConfigOptions, jsonGlobalIgnores } from "../json.ts";
import { definePackageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { WorkleapPlugin } from "../plugins/workleapPlugin.ts";
import { defineTestingLibraryConfig, type TestingLibraryConfigOptions, testingLibraryGlobalIgnores } from "../testingLibrary.ts";
import { defineTypeScriptConfig, type TypeScriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { defineVitestConfig, type VitestConfigOptions, vitestGlobalIgnores } from "../vitest.ts";
import { defineYamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

export interface DefineTypeScriptLibraryConfigOptions {
    testFramework?: "vitest" | "jest";
    core?: CoreConfigOptions;
    jest?: JestConfigOptions;
    json?: JsonConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    testingLibrary?: TestingLibraryConfigOptions;
    typescript?: TypeScriptConfigOptions;
    vitest?: VitestConfigOptions;
    yaml?: YamlConfigOptions;
}

/**
 * @param tsconfigRootDir The directory of the tsconfig file to use for rules that needs a TypeScript type check: https://typescript-eslint.io/packages/parser/#tsconfigrootdir.
 * @param options An optional object of options for the ESlint core and plugins rules.
 */
export function defineTypeScriptLibraryConfig(tsconfigRootDir: string, options: DefineTypeScriptLibraryConfigOptions = {}) {
    const {
        testFramework = "vitest",
        core,
        jest,
        json,
        packageJson,
        testingLibrary,
        typescript,
        vitest,
        yaml
    } = options;

    return defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            "**/__snapshots__/*",
            ".playwright",
            ".turbo",
            ...coreGlobalIgnores,
            ...jestGlobalIgnores,
            ...jsonGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...testingLibraryGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...vitestGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        ...defineCoreConfig(core),
        ...defineJestConfig({
            ...jest,
            enabled: jest?.enabled ?? testFramework === "jest"
        }),
        ...defineJsonConfig(json),
        ...definePackageJsonConfig(packageJson),
        ...defineTestingLibraryConfig(testingLibrary),
        ...defineTypeScriptConfig(tsconfigRootDir, typescript),
        // Temporary fix until the vitest plugin support defineConfig and the types are fixed.
        ...(defineVitestConfig({
            ...vitest,
            enabled: vitest?.enabled ?? testFramework === "vitest"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any),
        ...defineYamlConfig(yaml),
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
