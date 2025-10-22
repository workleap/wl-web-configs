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

/*

The WHY for the interface instead of using nested "extends".

1- ESlint flat config doesn't support nested "extends":

Each configuration object may have an extends key, but only at the top level — not inside another config that already came from an extends.

Flat config was designed to be explicitly ordered and fully expanded:

- "extends" in flat config is syntactic sugar for concatenating multiple config objects.
- Allowing recursion would make config evaluation order ambiguous and slow.

So ESLint enforces a one-level-deep rule:

- only a top-level config object can have extends.

2- Each object in the array is evaluated independently. "plugins" declared in one object are not inherited by the next object.
So when a second object sets the rule using a plugin "xyz", it doesn’t "see" the plugin "xyz" that’s defined inside a predefine config, and ESLint throws.

3- Trying to redefine a plugin that as already been define in a configuration object will throw: Cannot redefine plugin "xyz".

*/

//     rules: {
//         // Custom WorkLeap rules
//         "@workleap/strict-css-modules-names": "warn"
//     }

export interface DefineWebApplicationConfigOptions {
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
export const defineWebApplicationConfig = (tsconfigRootDir: string, options: DefineWebApplicationConfigOptions = {}) => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        ...(vitestConfig(vitest) as any),
        ...testingLibraryConfig(testingLibrary),
        ...storybookConfig(storybook),
        ...packageJsonConfig(packageJson),
        ...yamlConfig(yaml)
    ]);
};
