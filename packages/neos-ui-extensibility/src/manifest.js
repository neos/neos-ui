export default manifests => {
    return function manifest(identifier, options, bootstrap) {
        manifests.push({
            [identifier]: {
                options,
                bootstrap
            }
        });
    };
};
