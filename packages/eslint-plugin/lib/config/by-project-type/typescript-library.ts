import type { Linter } from "eslint";
import workleapPlugin from "../../index.ts";
import core from "../core.ts";
import jest from "../jest.ts";
import mdx from "../mdx.ts";
import packageJson from "../package-json.ts";
import testingLibrary from "../testing-library.ts";
import typescript from "../typescript.ts";
import yml from "../yaml.ts";

const config: Linter.FlatConfig[] = [
    {
        ignores: ["dist/"]
    },
    ...core,
    ...typescript,
    ...jest,
    ...testingLibrary,
    ...mdx,
    ...packageJson,
    ...yml
];

export default config;
