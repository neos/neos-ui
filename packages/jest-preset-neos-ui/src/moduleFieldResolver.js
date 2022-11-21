// this allows jest to also use the esm `module` field in package.json (like esbuild and any other bundler does)
// see https://jestjs.io/docs/configuration#resolver-string
module.exports = (path, options) => {
    // Call the defaultResolver, so we leverage its cache, error handling, etc.
    return options.defaultResolver(path, {
        ...options,
        // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
        packageFilter: (pkg) => {
            return {
                ...pkg,
                // Alter the value of `main` before resolving the package
                main: pkg.module || pkg.main,
            };
        },
    });
};
