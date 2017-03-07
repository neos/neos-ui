module.exports = {
    isCi: process.env.CI,
    isTesting: process.env.TEST,
    isStorybook: process.env.STORY,
    isProduction: process.env.NODE_ENV === 'production',
    rootPath: process.env.NEOS_BUILD_ROOT
};
