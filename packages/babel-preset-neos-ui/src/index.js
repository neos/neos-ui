module.exports = function (api) {
    api.cache(true);

    const presets = [
        [
            "@babel/preset-env",
            {
                modules: false,
                debug: false,
                useBuiltIns: "usage"
            },
        ],
        ["@babel/preset-react"],
    ];

    const plugins = [
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-syntax-jsx",
        "@babel/plugin-transform-modules-commonjs",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-regenerator",
        ["@babel/plugin-proposal-class-properties", { loose: true }],
    ];

    return {
        presets,
        plugins,
    };
};
