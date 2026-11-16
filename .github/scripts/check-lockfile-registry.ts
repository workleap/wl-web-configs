// Fails when an install could fetch a package from anywhere but the npm registry.
//
// pnpm-lock.yaml records a package resolved from the default registry with its integrity hash only. A tarball URL,
// a git repository or another registry adds a field to the resolution (`tarball`, `repo`, `type`, ...).
//
// The script runs before the install, so it has no dependency and reads the lockfile line by line. It only accepts
// the layout pnpm writes: any other way to write an entry or a resolution is rejected.
//
// Usage: node .github/scripts/check-lockfile-registry.ts
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const ExpectedRegistry = "https://registry.npmjs.org/";

const PackageEntry = /^ {2}\S[^{]*:$/;
const RegistryResolution = /^ {4}resolution: \{integrity: sha512-[A-Za-z0-9+/]+={0,2}\}$/;

// Returns the lines of the lockfile that are not a package resolved from the registry, each prefixed by its line number.
export function findForeignResolutions(lockfile: string) {
    const lines = lockfile.split(/\r?\n/);
    const errors: string[] = [];
    let isPackagesSection = false;
    let hasPackagesSection = false;

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];

        if (/^\S/.test(line)) {
            isPackagesSection = line === "packages:";
            hasPackagesSection ||= isPackagesSection;
        } else if (isPackagesSection && /^ {2}\S/.test(line)) {
            // A package entry is its key alone on a line, followed by its resolution.
            if (!PackageEntry.test(line)) {
                errors.push(`${index + 1}: ${line.trim()}`);
            } else if (!RegistryResolution.test(lines[index + 1] ?? "")) {
                errors.push(`${index + 2}: ${(lines[index + 1] ?? "").trim()}`);
            }

            // The resolution was checked with its entry.
            index += 1;
        } else if (line.includes("resolution") || line.includes("tarball")) {
            // A resolution anywhere else: a second one in an entry, or one outside of the packages section.
            errors.push(`${index + 1}: ${line.trim()}`);
        }
    }

    return hasPackagesSection ? errors : ["The lockfile has no `packages:` section."];
}

if (import.meta.main) {
    const errors = findForeignResolutions(readFileSync("pnpm-lock.yaml", "utf8")).map(x => `pnpm-lock.yaml:${x}`);
    const registry = execSync("pnpm config get registry", { encoding: "utf8" }).trim();

    if (registry !== ExpectedRegistry) {
        errors.push(`The pnpm registry is "${registry}", expected "${ExpectedRegistry}".`);
    }

    if (errors.length > 0) {
        console.error(`::error::The dependencies must only resolve from ${ExpectedRegistry}\n${errors.join("\n")}`);
        process.exit(1);
    }

    console.log(`Every package of pnpm-lock.yaml resolves from ${ExpectedRegistry}`);
}
