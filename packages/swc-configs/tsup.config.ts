import { defineBuildConfig } from "@workleap/tsup-configs";

export default defineBuildConfig({
    format: ["esm", "cjs"],
    platform: "node"
});
