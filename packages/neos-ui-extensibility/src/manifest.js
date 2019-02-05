export default manifests => {
    return function (identifier, options, bootstrap) {
        manifests.push({
            [identifier]: {
                options,
                bootstrap
            }
        });
    };
};
