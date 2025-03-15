import { test } from "vitest";
import type { RuleSetRule, RuleSetUseItem, Configuration as WebpackConfig } from "webpack";
import { matchLoaderName, matchTest, removeModuleRules } from "../../src/transformers/moduleRules.ts";

test.concurrent("when a matching module rule is found in the rules array, remove the module rule", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    removeModuleRules(config, matchTest(/\.svg/i));

    expect(config.module?.rules?.length).toBe(2);
    expect((config.module?.rules![1] as RuleSetRule).type).toBe("asset/resource");
});

test.concurrent("when a matching module rule is found in a \"oneOf\" prop, remove the module rule", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
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
                }
            ]
        }
    };

    removeModuleRules(config, matchTest(/\.svg/i));

    expect((config.module?.rules![1] as RuleSetRule).oneOf!.length).toBe(1);
    expect(((config.module?.rules![1] as RuleSetRule).oneOf![0] as RuleSetRule).type).toBe("asset/resource");
});

test.concurrent("when a matching module rule is found in a \"use\" prop, remove the module rule", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    use: [
                        { loader: "babel-loader" },
                        { loader: "esbuild-loader" },
                        { loader: "swc-loader" }
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

    removeModuleRules(config, matchLoaderName("babel-loader"));

    expect(((config.module?.rules![0] as RuleSetRule).use as RuleSetUseItem[]).length).toBe(2);
    // Type inference is broken because RuleSetUseItem can be a string.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(((config.module?.rules![0] as RuleSetRule).use as RuleSetUseItem[])[0].loader).toBe("esbuild-loader");
});

test.concurrent("when multiple matching module rules are found within the same parent, remove all the module rules", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    test: /\.svg/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    removeModuleRules(config, matchTest(/\.svg/i));

    expect(config.module?.rules?.length).toBe(2);
    expect((config.module?.rules![1] as RuleSetRule).type).toBe("asset/resource");
});

test.concurrent("when multiple matching module rules are found in the rules array and a \"oneOf\" prop, remove all the module rules", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    oneOf: [
                        {
                            test: /\.svg/i,
                            type: "asset/resource"
                        }
                    ]
                }
            ]
        }
    };

    removeModuleRules(config, matchTest(/\.svg/i));

    // root
    expect(config.module?.rules?.length).toBe(3);
    expect((config.module?.rules![1] as RuleSetRule).type).toBe("asset/resource");

    // oneOf
    expect((config.module?.rules![2] as RuleSetRule).oneOf!.length).toBe(0);
});

test.concurrent("when multiple matching module rules are found in the rules array and a \"use\" prop, remove all the module rules", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                },
                {
                    test: /\.(js|jsx)/i,
                    use: [
                        { loader: "swc-loader" }
                    ]
                }
            ]
        }
    };

    removeModuleRules(config, matchLoaderName("swc-loader"));

    // root
    expect(config.module?.rules?.length).toBe(3);
    expect((config.module?.rules![0] as RuleSetRule).type).toBe("asset/inline");

    // use
    expect(((config.module?.rules![2] as RuleSetRule).use as RuleSetUseItem[]).length).toBe(0);
});

test.concurrent("when no matching module rule is found, throw an error", ({ expect }) => {
    const config: WebpackConfig = {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)/i,
                    loader: "swc-loader"
                },
                {
                    test: /\.svg/i,
                    type: "asset/inline"
                },
                {
                    test: /\.(png|jpe?g|gif)/i,
                    type: "asset/resource"
                }
            ]
        }
    };

    expect(() => removeModuleRules(config, matchTest(/\.(js|jsx)/i))).toThrow();

    expect(config.module?.rules?.length).toBe(3);
});
