import { test } from "vitest";
import type { Configuration } from "webpack";
import { addAfterPlugin, matchConstructorName } from "../../src/transformers/plugins.ts";

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

test.concurrent("when a matching plugin is found in the plugins array, add after the plugin", ({ expect }) => {
    const newPlugin = new Plugin3();

    const config: Configuration = {
        plugins: [
            new Plugin1(),
            new Plugin2()
        ]
    };

    addAfterPlugin(config, matchConstructorName(Plugin2.name), [newPlugin]);

    expect(config.plugins?.length).toBe(3);
    expect(config.plugins![2]).toBe(newPlugin);
});

test.concurrent("when no matching plugin is found, throw an error", ({ expect }) => {
    const newPlugin = new Plugin3();

    const config: Configuration = {
        plugins: [
            new Plugin1(),
            new Plugin2()
        ]
    };

    expect(() => addAfterPlugin(config, matchConstructorName("anything"), [newPlugin])).toThrow();
});
