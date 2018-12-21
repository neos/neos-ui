export default (manifests: any[]) => {
    return (identifier: string, options: {}, bootstrap: () => void) => {
        manifests.push({
            [identifier]: {
                options,
                bootstrap
            }
        });
    };
};
