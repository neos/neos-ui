module.exports = function () {
    return {
        presets: ["@babel/react", "@babel/env"],
        plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            "@babel/plugin-syntax-jsx",
            "@babel/plugin-proposal-object-rest-spread",
        ],
    };
};
