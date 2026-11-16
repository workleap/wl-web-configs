// node --test .github/scripts/check-lockfile-registry.test.ts
import { deepStrictEqual } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { findForeignResolutions } from "./check-lockfile-registry.ts";

const RootPath = join(import.meta.dirname, "../..");

void describe("findForeignResolutions", () => {
    const lockfile = (...packages: string[]) =>
        ["lockfileVersion: '9.0'", "", "packages:", "", ...packages, "", "snapshots:", "", "  yaml@2.9.1: {}"].join("\n");

    void it("accepts the lockfile of this repository", () => {
        deepStrictEqual(findForeignResolutions(readFileSync(join(RootPath, "pnpm-lock.yaml"), "utf8")), []);
    });

    void it("accepts a package resolved from the registry", () => {
        deepStrictEqual(
            findForeignResolutions(lockfile("  yaml@2.9.1:", "    resolution: {integrity: sha512-abc+/0==}", "    engines: {node: '>= 14.6'}")),
            []
        );
    });

    void it("rejects a tarball URL, a git repository and a resolution without an integrity hash", () => {
        const packages = [
            "  a@1.0.0:",
            "    resolution: {integrity: sha512-abc, tarball: https://example.com/a.tgz}",
            "  b@1.0.0:",
            "    resolution: {commit: 0123abc, repo: https://github.com/example/b.git, type: git}",
            "  c@1.0.0:",
            "    resolution: {tarball: https://example.com/c.tgz}"
        ];

        deepStrictEqual(findForeignResolutions(lockfile(...packages)), [
            "6: resolution: {integrity: sha512-abc, tarball: https://example.com/a.tgz}",
            "8: resolution: {commit: 0123abc, repo: https://github.com/example/b.git, type: git}",
            "10: resolution: {tarball: https://example.com/c.tgz}"
        ]);
    });

    void it("rejects a resolution that is not written the way pnpm writes it", () => {
        deepStrictEqual(findForeignResolutions(lockfile("  a@1.0.0:", '    "resolution": {tarball: https://example.com/a.tgz}')), [
            '6: "resolution": {tarball: https://example.com/a.tgz}'
        ]);
        deepStrictEqual(findForeignResolutions(lockfile("  a@1.0.0: {resolution: {tarball: https://example.com/a.tgz}}")), [
            "5: a@1.0.0: {resolution: {tarball: https://example.com/a.tgz}}"
        ]);
        deepStrictEqual(findForeignResolutions(lockfile("  a@1.0.0:", "    engines: {node: '>= 14.6'}", "    resolution: {integrity: sha512-abc}")), [
            "6: engines: {node: '>= 14.6'}",
            "7: resolution: {integrity: sha512-abc}"
        ]);
        deepStrictEqual(
            findForeignResolutions(
                lockfile("  a@1.0.0:", "    resolution: {integrity: sha512-abc}", "    resolution: {tarball: https://example.com/a.tgz}")
            ),
            ["7: resolution: {tarball: https://example.com/a.tgz}"]
        );
    });

    void it("rejects a lockfile without a packages section", () => {
        deepStrictEqual(findForeignResolutions("lockfileVersion: '9.0'\n"), ["The lockfile has no `packages:` section."]);
    });
});
