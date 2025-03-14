import path from "node:path";
import { defineBuildConfig } from "./src/build.ts";

export default defineBuildConfig({
    target: "node",
    tsconfigPath: path.resolve("./tsconfig.build.json")
});
