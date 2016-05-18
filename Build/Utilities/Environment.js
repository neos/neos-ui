module.exports = {
    isCi: process.env.CI,
    isTesting: process.env.TEST,
    isStorybook: process.env.STORY
};
