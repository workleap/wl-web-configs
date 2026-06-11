const config: string[] = [
    "last 2 versions",
    "> 0.2%",
    "Firefox ESR",
    "not dead"
];

// Using TypeScript "export =" until browserslist supports ESM configs.
// It's the only syntax emitting `module.exports = config`, which browserslist
// expects since it loads configs via require().
export = config;
