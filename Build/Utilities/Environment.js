// ToDo: Duplicate of `packages/build-essentials/src/environment.js`
module.exports = {
    isCi: process.env.CI,
    isTesting: process.env.TEST,
    isStorybook: process.env.STORY
};
