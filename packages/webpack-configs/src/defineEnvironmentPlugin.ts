import type { Compiler, DefinePlugin, WebpackPluginInstance } from "webpack";

type DefinePluginDefinitions = DefinePlugin["definitions"];

// A "DefinePlugin" instance must be created from the same webpack instance that owns the
// "Compilation" it hooks into. In a pnpm workspace, "@workleap/webpack-configs" and the consuming
// application can resolve two distinct physical copies of webpack because their optional-peer
// contexts differ (e.g. webpack-cli on the app side, esbuild/postcss on this package's side). Since
// webpack 5.108, "DefinePlugin.getCompilationHooks" throws when the "Compilation" comes from a
// different webpack instance ("The 'compilation' argument must be an instance of Compilation").
//
// Deferring the instantiation until "apply" and reading "DefinePlugin" from "compiler.webpack"
// guarantees the plugin is always created from the compiler's own webpack instance, regardless of
// how pnpm resolved the peer graph. This mirrors how first-party plugins (e.g. terser-webpack-plugin,
// react-refresh-webpack-plugin) already source webpack from the compiler.
//
// See https://github.com/workleap/wl-web-configs/issues/451.
export class DefineEnvironmentPlugin implements WebpackPluginInstance {
    readonly #definitions: DefinePluginDefinitions;

    constructor(definitions: DefinePluginDefinitions) {
        this.#definitions = definitions;
    }

    apply(compiler: Compiler) {
        new compiler.webpack.DefinePlugin(this.#definitions).apply(compiler);
    }
}
