import type { DistPathConfig, RsbuildConfig, RsbuildPlugin, SourceMap } from "@rsbuild/core";
import { test, vi } from "vitest";
import type { RsbuildConfigTransformer } from "../src/applyTransformers.ts";
import { defineDevConfig } from "../src/dev.ts";

test.concurrent("when an entry prop is provided, the source.entry option is the provided value", ({ expect }) => {
    const result = defineDevConfig({
        entry: {
            index: "./a-new-entry.ts"
        }
    });

    expect(result.source?.entry!.index).toBe("./a-new-entry.ts");
});

test.concurrent("when https is true, the server option is configured with a self signed certificate", ({ expect }) => {
    const result = defineDevConfig({
        https: true
    });

    expect(result.server?.https).toBeUndefined();
    expect(result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:basic-ssl")).toBeDefined();
});

test.concurrent("when https is a certificate, the server option is configured with the provided certificate", ({ expect }) => {
    const cert = {
        key: "foo",
        cert: "bar"
    };

    const result = defineDevConfig({
        https: cert
    });

    expect(result.server?.https).toBe(cert);
});

test.concurrent("when https is false, the basic-ssl plugin is not included", ({ expect }) => {
    const result = defineDevConfig({
        https: false
    });

    expect(result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:basic-ssl")).toBeUndefined();
});

test.concurrent("when https is false, the server.https option is undefined", ({ expect }) => {
    const result = defineDevConfig({
        https: true
    });

    expect(result.server?.https).toBeUndefined();
});

test.concurrent("when an asset prefix is provided, the dev.assetPrefix option is the provided value", ({ expect }) => {
    const result = defineDevConfig({
        assetPrefix: "http://my-dev-host.com"
    });

    expect(result.dev?.assetPrefix).toBe("http://my-dev-host.com");
});

test.concurrent("when additional plugins are provided, append the provided plugins at the end of the plugins array", ({ expect }) => {
    const plugin1: RsbuildPlugin = {
        name: "plugin-1",
        setup: () => {}
    };

    const plugin2: RsbuildPlugin = {
        name: "plugin-2",
        setup: () => {}
    };

    const result = defineDevConfig({
        plugins: [
            plugin1,
            plugin2
        ]
    });

    const pluginsCount = result.plugins!.length;

    expect(result.plugins![pluginsCount - 2]).toBe(plugin1);
    expect(result.plugins![pluginsCount - 1]).toBe(plugin2);
});

test.concurrent("when html is false, the html option is undefined", ({ expect }) => {
    const result = defineDevConfig({
        html: false
    });

    expect(result.html).toBeUndefined();
});

test.concurrent("when html is a function, the html option match the function return value", ({ expect }) => {
    const html = {
        title: "foo"
    };

    const result = defineDevConfig({
        html: () => {
            return html;
        }
    });

    expect(result.html).toBe(html);
});

test.concurrent("when lazyCompilation is true, the dev.lazyCompilation option is true", ({ expect }) => {
    const result = defineDevConfig({
        lazyCompilation: true
    });

    expect(result.dev?.lazyCompilation).toBeTruthy();
});

test.concurrent("when lazyCompilation is false, the dev.lazyCompilation option is false", ({ expect }) => {
    const result = defineDevConfig({
        lazyCompilation: false
    });

    expect(result.dev?.lazyCompilation).toBeFalsy();
});

test.concurrent("when hmr is true, the dev.hmr option is true", ({ expect }) => {
    const result = defineDevConfig({
        hmr: true
    });

    expect(result.dev?.hmr).toBeTruthy();
});

test.concurrent("when hmr amd fastRefresh are false, the dev.hmr option is false", ({ expect }) => {
    const result = defineDevConfig({
        hmr: false,
        fastRefresh: false
    });

    expect(result.dev?.hmr).toBeFalsy();
});

test.concurrent("when hmr is false and fastRefresh is true, the dev.hmr option is true", ({ expect }) => {
    const result = defineDevConfig({
        hmr: false,
        fastRefresh: true
    });

    expect(result.dev?.hmr).toBeTruthy();
});

test.concurrent("when fastRefresh is true, the react plugin enable fast refresh", ({ expect }) => {
    let isEnabled = false;

    const result = defineDevConfig({
        fastRefresh: true,
        react: defaultOptions => {
            isEnabled = defaultOptions.fastRefresh === true;

            return defaultOptions;
        }
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeDefined();
    expect(isEnabled).toBeTruthy();
});

test.concurrent("when fastRefresh is true and the overlay is disable, disable the fast refresh overlay", ({ expect }) => {
    let isOverlayDisabled = false;

    const result = defineDevConfig({
        fastRefresh: true,
        overlay: false,
        react: defaultOptions => {
            isOverlayDisabled = defaultOptions.reactRefreshOptions?.overlay === false;

            return defaultOptions;
        }
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeDefined();
    expect(isOverlayDisabled).toBeTruthy();
});

test.concurrent("when fastRefresh is true, disable the client overlay", ({ expect }) => {
    const result = defineDevConfig({
        fastRefresh: true
    });

    expect(result.dev?.client?.overlay).toBeFalsy();
});

test.concurrent("when sourceMap is false, the output.sourceMap option is false", ({ expect }) => {
    const result = defineDevConfig({
        sourceMap: false
    });

    expect(result.output?.sourceMap).toBeFalsy();
});

test.concurrent("when sourceMap is an object, the output.sourceMap option is the object", ({ expect }) => {
    const sourceMap: SourceMap = {
        js: false,
        css: false
    };

    const result = defineDevConfig({
        sourceMap
    });

    expect(result.output?.sourceMap).toBe(sourceMap);
});

test.concurrent("when overlay is false, the dev.client.overlay option is false", ({ expect }) => {
    const result = defineDevConfig({
        overlay: false
    });

    expect(result.dev?.client?.overlay).toBeFalsy();
});

test.concurrent("when overlay is false, react plugin fast refresh overlay is disabled", ({ expect }) => {
    let isOverlayDisabled = false;

    defineDevConfig({
        overlay: false,
        react: defaultOptions => {
            isOverlayDisabled = defaultOptions.reactRefreshOptions?.overlay === false;

            return defaultOptions;
        }
    });

    expect(isOverlayDisabled).toBeTruthy();
});

test.concurrent("when writeToDisk is true, the dev.writeToDisk option is true", ({ expect }) => {
    const result = defineDevConfig({
        writeToDisk: true
    });

    expect(result.dev?.writeToDisk).toBeTruthy();
});

test.concurrent("when react is false, the react plugin is not included", ({ expect }) => {
    const result = defineDevConfig({
        react: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:react");

    expect(plugin).toBeUndefined();
});

test.concurrent("when react is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineDevConfig({
        react: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when svgr is false, the svgr plugin is not included", ({ expect }) => {
    const result = defineDevConfig({
        svgr: false
    });

    const plugin = result.plugins?.find(x => (x as RsbuildPlugin).name === "rsbuild:svgr");

    expect(plugin).toBeUndefined();
});

test.concurrent("when svgr is a function, the function is executed", ({ expect }) => {
    const fct = vi.fn();

    defineDevConfig({
        svgr: fct
    });

    expect(fct).toHaveBeenCalledTimes(1);
});

test.concurrent("when a transformer is provided, and the transformer update the existing configuration object, the transformer is applied on the Rsbuild config", ({ expect }) => {
    const entryTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const result = defineDevConfig({
        transformers: [entryTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when a transformer is provided, and the transformer returns a new configuration object, the transformer is applied on the Rsbuild config", ({ expect }) => {
    const entryTransformer: RsbuildConfigTransformer = () => {
        return {
            source: {
                entry: {
                    index: "a-custom-value-in-a-transformer"
                }
            }
        };
    };

    const result = defineDevConfig({
        transformers: [entryTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
});

test.concurrent("when multiple transformers are provided, all the transformers are applied on the webpack config", ({ expect }) => {
    const entryTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
        config.source = config.source ?? {};
        config.source.entry = {
            index: "a-custom-value-in-a-transformer"
        };

        return config;
    };

    const distPathTransformer: RsbuildConfigTransformer = (config: RsbuildConfig) => {
        config.output = config.output ?? {};
        config.output.distPath = (config.output.distPath ?? {}) as DistPathConfig;
        config.output.distPath.js = "a-custom-dist-path-in-a-tranformer";

        return config;
    };

    const result = defineDevConfig({
        transformers: [entryTransformer, distPathTransformer]
    });

    expect(result.source!.entry!.index).toBe("a-custom-value-in-a-transformer");
    expect((result.output!.distPath as DistPathConfig).js).toBe("a-custom-dist-path-in-a-tranformer");
});

test.concurrent("transformers context environment is \"dev\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig({
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev", verbose: false });
});

test.concurrent("when the verbose option is true, the transformers context verbose value is \"true\"", ({ expect }) => {
    const mockTransformer = vi.fn();

    defineDevConfig({
        verbose: true,
        transformers: [mockTransformer]
    });

    expect(mockTransformer).toHaveBeenCalledWith(expect.anything(), { environment: "dev", verbose: true });
});

