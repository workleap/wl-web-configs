import type { Config } from "jest";
import { swcConfig } from "./swc.jest.ts";

const config: Config = {
    testRegex: "/tests/*/.*\\.test\\.(ts|tsx)$",
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": ["@swc/jest", swcConfig]
    },
    moduleNameMapper: {
        "\\.css$": "identity-obj-proxy"
    },
    cacheDirectory: "./node_modules/.cache/jest",
    clearMocks: true,
    verbose: true
};

export default config;
