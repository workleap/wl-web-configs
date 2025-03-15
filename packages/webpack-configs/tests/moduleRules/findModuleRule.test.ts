import { test } from "vitest";
import type { RuleSetRule, Configuration as WebpackConfig } from "webpack";
import { findModuleRule, matchAssetModuleType, matchLoaderName } from "../../src/transformers/moduleRules.ts";

test.concurrent("when the webpack configuration doesn't have a module section, return undefined", ({ expect }) => {
    const result = findModuleRule({}, matchAssetModuleType("asset/resource"));

    expect(result).toBeUndefined();
});

test.concurrent("when the webpack configuration doesn't have a rule section, return undefined", ({ expect }) => {
    const config: WebpackConfig = {
        module: {}
    };

    const result = findModuleRule(config, matchAssetModuleType("asset/resource"));

    expect(result).toBeUndefined();
});

test.concurrent("when the matching rule is the first rule of the rules array, return the matching rule", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    const result = findModuleRule(config, matchAssetModuleType("asset/inline"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(0);
    expect(result?.parent).toBe(config.module?.rules);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.type).toBe("asset/inline");
});

test.concurrent("when the matching rule is the last rule of the rules array, return the matching rule", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                }
            ]
        }
    };

    const result = findModuleRule(config, matchAssetModuleType("asset/inline"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(2);
    expect(result?.parent).toBe(config.module?.rules);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.type).toBe("asset/inline");
});

test.concurrent("when the matching rule is nested in a \"oneOf\" prop and is the first rule of the array, return the matching rule", ({ expect }) => {
    const oneOfRule: RuleSetRule = {
        oneOf: [
            {
                test: /\.svg/i,
                type: "asset/inline"
            },
            {
                test: /\.(png|jpe?g|gif)/i,
                type: "asset/resource"
            }
        ]
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                oneOfRule,
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                }
            ]
        }
    };

    const result = findModuleRule(config, matchAssetModuleType("asset/inline"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(0);
    expect(result?.parent).toBe(oneOfRule.oneOf);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.type).toBe("asset/inline");
});

test.concurrent("when the matching rule is nested in a \"oneOf\" prop and is the last rule of the array, return the matching rule", ({ expect }) => {
    const oneOfRule: RuleSetRule = {
        oneOf: [
            {
                test: /\.(png|jpe?g|gif)/i,
                type: "asset/resource"
            },
            {
                test: /\.svg/i,
                type: "asset/inline"
            }
        ]
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                oneOfRule,
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                }
            ]
        }
    };

    const result = findModuleRule(config, matchAssetModuleType("asset/inline"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(1);
    expect(result?.parent).toBe(oneOfRule.oneOf);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.type).toBe("asset/inline");
});

test.concurrent("when the matching rule is nested in a \"use\" prop and is the first rule of the array, return the matching rule", ({ expect }) => {
    const tsModuleRule = {
        test: /\.(ts|tsx)/i,
        use: [
            { loader: "swc-loader" },
            { loader: "babel-loader" },
            { loader: "esbuild-loader" }
        ]
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                tsModuleRule,
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    const result = findModuleRule(config, matchLoaderName("swc-loader"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(0);
    expect(result?.parent).toBe(tsModuleRule.use);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.loader).toBe("swc-loader");
});

test.concurrent("when the matching rule is nested in a \"use\" prop and is the last rule of the array, return the matching rule", ({ expect }) => {
    const tsModuleRule = {
        test: /\.(ts|tsx)/i,
        use: [
            { loader: "babel-loader" },
            { loader: "esbuild-loader" },
            { loader: "swc-loader" }
        ]
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                tsModuleRule
            ]
        }
    };

    const result = findModuleRule(config, matchLoaderName("swc-loader"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(2);
    expect(result?.parent).toBe(tsModuleRule.use);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.loader).toBe("swc-loader");
});

test.concurrent("when the matching rule is nested in a \"oneOf\" prop then in a \"use\" prop, return the matching rule", ({ expect }) => {
    const tsRule = {
        test: /\.(ts|tsx)/i,
        use: [
            { loader: "swc-loader" }
        ]
    };

    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    oneOf: [
                        tsRule,
                        {
                            test: /\.(ts|tsx)/i,
                            loader: "babel-loader"
                        }
                    ]
                },
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    const result = findModuleRule(config, matchLoaderName("swc-loader"));

    expect(result).toBeDefined();
    expect(result?.index).toBe(0);
    expect(result?.parent).toBe(tsRule.use);

    const match = result?.moduleRule as RuleSetRule;

    expect(match).toBeDefined();
    expect(match.loader).toBe("swc-loader");
});

test.concurrent("when there are no matching rule, return undefined", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.js/i,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    const result = findModuleRule(config, matchAssetModuleType("asset/inline"));

    expect(result).toBeUndefined();
});

test.concurrent("throw an error when multiple module rules are found", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.json/i,
                    type: "asset/inline"
                }
            ]
        }
    };

    expect(() => findModuleRule(config, matchAssetModuleType("asset/inline"))).toThrow();
});

test.concurrent("when a module rule is undefined, do not throw", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                // Since Webpack configs are usually untyped, it's preferable to test this.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                undefined,
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                }
            ]
        }
    };

    expect(() => findModuleRule(config, matchAssetModuleType("asset/inline"))).not.toThrow();
});

test.concurrent("when an undefined module rule is nested in a \"oneOf\" prop, do not throw", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    oneOf: [
                        // Since Webpack configs are usually untyped, it's preferable to test this.
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        undefined
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                }
            ]
        }
    };

    expect(() => findModuleRule(config, matchAssetModuleType("asset/inline"))).not.toThrow();
});

