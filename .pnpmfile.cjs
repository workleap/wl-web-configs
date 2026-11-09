// The package firewall's metadata points tarballs at registry.npmjs.org. Without this hook, pnpm writes
// those direct URLs into pnpm-lock.yaml and later frozen installs download around the firewall.
// Dropping them makes pnpm build each download URL from the configured registry (the firewall).
const DIRECT_NPM_TARBALL = /^https:\/\/registry\.npmjs\.org\//;

module.exports = {
    hooks: {
        afterAllResolved(lockfile) {
            for (const pkg of Object.values(lockfile.packages ?? {})) {
                if (DIRECT_NPM_TARBALL.test(pkg.resolution?.tarball ?? "")) {
                    delete pkg.resolution.tarball;
                }
            }

            return lockfile;
        }
    }
};
