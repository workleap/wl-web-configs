import { defineConfig, globalIgnores } from "eslint/config";
import { coreConfig, type CoreConfigOptions, coreGlobalIgnores } from "../core.ts";
import { jestConfig, type JestConfigOptions, jestGlobalIgnores } from "../jest.ts";
import { jsxAllyConfig, type JsxAllyConfigOptions, jsxAllyGlobalIgnores } from "../jsxAlly.ts";
import { packageJsonConfig, type PackageJsonConfigOptions, packageJsonGlobalIgnores } from "../packageJson.ts";
import { reactConfig, type ReactConfigOptions, reactGlobalIgnores } from "../react.ts";
import { storybookConfig, type StorybookConfigOptions, storybookGlobalIgnores } from "../storybook.ts";
import { testingLibraryConfig, type TestingLibraryConfigOptions, testingLibraryGlobalIgnores } from "../testingLibrary.ts";
import { typescriptConfig, type TypescriptConfigOptions, typescriptGlobalIgnores } from "../typescript.ts";
import { vitestConfig, type VitestConfigOptions, vitestGlobalIgnores } from "../vitest.ts";
import { yamlConfig, type YamlConfigOptions, yamlGlobalIgnores } from "../yaml.ts";

//     rules: {
//         // Custom WorkLeap rules
//         "@workleap/strict-css-modules-names": "warn"
//     }

export interface DefineReactLibraryConfigOptions {
    core?: CoreConfigOptions;
    typescript?: TypescriptConfigOptions;
    react?: ReactConfigOptions;
    jsxAlly?: JsxAllyConfigOptions;
    jest?: JestConfigOptions;
    vitest?: VitestConfigOptions;
    testingLibrary?: TestingLibraryConfigOptions;
    storybook?: StorybookConfigOptions;
    packageJson?: PackageJsonConfigOptions;
    yaml?: YamlConfigOptions;
}

/**
 * @param tsconfigRootDir The directory of the tsconfig file to use for rules that needs a TypeScript type check: https://typescript-eslint.io/packages/parser/#tsconfigrootdir.
 * @param options An optional object of options for the ESlint core and plugins rules.
 */
export function defineReactLibraryConfig(tsconfigRootDir: string, options: DefineReactLibraryConfigOptions = {}) {
    const {
        core,
        typescript,
        react,
        jsxAlly,
        jest,
        vitest,
        testingLibrary,
        storybook,
        packageJson,
        yaml
    } = options;

    return defineConfig([
        // node_modules folder is ignored by default.
        globalIgnores([
            "dist",
            ...coreGlobalIgnores,
            ...typescriptGlobalIgnores,
            ...reactGlobalIgnores,
            ...jsxAllyGlobalIgnores,
            ...jestGlobalIgnores,
            ...vitestGlobalIgnores,
            ...testingLibraryGlobalIgnores,
            ...storybookGlobalIgnores,
            ...packageJsonGlobalIgnores,
            ...yamlGlobalIgnores
        ]),
        ...coreConfig(core),
        ...typescriptConfig(tsconfigRootDir, typescript),
        ...reactConfig(react),
        ...jsxAllyConfig(jsxAlly),
        ...jestConfig(jest),
        // Temporary fix until the vitest plugin support defineConfig and the types are fixed.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(vitestConfig(vitest) as any),
        ...testingLibraryConfig(testingLibrary),
        ...storybookConfig(storybook),
        ...packageJsonConfig(packageJson),
        ...yamlConfig(yaml)
    ]);
}
