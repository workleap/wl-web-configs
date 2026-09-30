const config: string[] = [
    "last 2 versions",
    "> 0.2%",
    "Firefox ESR",
    "not dead",
    // The "> 0.2%" clause is based on global market share and pulls in browsers
    // no Workleap product serves. Excluding them avoids shipping core-js polyfills
    // that only exist for those targets.
    "not op_mini all",
    "not kaios > 0",
    "not and_uc > 0",
    "not and_qq > 0"
];

// Using TypeScript "export =" until browserslist supports ESM configs.
// It's the only syntax emitting `module.exports = config`, which browserslist
// expects since it loads configs via require().
export = config;
