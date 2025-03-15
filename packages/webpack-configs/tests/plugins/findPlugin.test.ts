import type { Configuration } from "mini-css-extract-plugin";
import { test } from "vitest";
import { findPlugin, matchConstructorName } from "../../src/transformers/plugins.ts";

class Plugin1 {
    apply() {
        console.log("I am plugin 1!");
    }
}

class Plugin2 {
    apply() {
        console.log("I am plugin 2!");
    }
}

class Plugin3 {
    apply() {
        console.log("I am plugin 3!");
    }
}

test.concurrent("when the webpack configuration doesn't have a plugins section, return undefined", ({ expect }) => {
    const result = findPlugin({}, matchConstructorName("anything"));

    expect(result).toBeUndefined();
});

test.concurrent("when the matching plugin is the first of the array, return the plugin", ({ expect }) => {
    const target = new Plugin1();

    const config: Configuration = {
        plugins: [
            target,
            new Plugin2(),
            new Plugin3()
        ]
    };

    const result = findPlugin(config, matchConstructorName(Plugin1.name));

    expect(result).toBeDefined();
    expect(result.index).toBe(0);

    const match = result.plugin;

    expect(match).toBeDefined();
    expect(match).toBe(target);
});

test.concurrent("when the matching plugin is the last of the array, return the plugin", ({ expect }) => {
    const target = new Plugin3();

    const config: Configuration = {
        plugins: [
            new Plugin1(),
            new Plugin2(),
            target
        ]
    };

    const result = findPlugin(config, matchConstructorName(Plugin3.name));

    expect(result).toBeDefined();
    expect(result.index).toBe(2);

    const match = result.plugin;

    expect(match).toBeDefined();
    expect(match).toBe(target);
});

test.concurrent("when there are no matching plugin, return undefined", ({ expect }) => {
    const config: Configuration = {
        plugins: [
            new Plugin1(),
            new Plugin2(),
            new Plugin3()
        ]
    };

    const result = findPlugin(config, matchConstructorName("anything"));

    expect(result).toBeUndefined();
});

test.concurrent("throw an error when multiple module plugins are found", ({ expect }) => {
    const config: Configuration = {
        plugins: [
            new Plugin1(),
            new Plugin2(),
            new Plugin3(),
            new Plugin1()
        ]
    };

    expect(() => findPlugin(config, matchConstructorName(Plugin1.name))).toThrow();
});

test.concurrent("when a plugin is undefined, do not throw", ({ expect }) => {
    const config: Configuration = {
        plugins: [
            new Plugin1(),
            // Since Webpack configs are usually untyped, it's preferable to test this.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            undefined,
            new Plugin3()
        ]
    };

    expect(() => findPlugin(config, matchConstructorName(Plugin1.name))).not.toThrow();
});

