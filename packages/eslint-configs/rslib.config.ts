import { defineBuildConfig } from "@workleap/rslib-configs";
import path from "node:path";

export default defineBuildConfig({
    target: "node",
    tsconfigPath: path.resolve("./tsconfig.build.json")
});
