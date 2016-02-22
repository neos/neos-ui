const selectors = require('./../../../Resources/Private/JavaScript/Shared/Constants/Selectors.js');

/**
 * Helper function to reset the global state of the PublishDropDown since we don't want to impair/share the state between tests.
 *
 * @todo: This should be handled globally, maybe even by the test setup/server?
 */
function reset() {
    if (browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn) === true) {
        showDropDown();

        browser.click(selectors.topBar.publishDropDown.discardAllBtn);
        browser.pause(4000);

        hideDropDown();
    }
}

/**
 * Checks if the publish dropdown is currently opened.
 *
 * @private
 * @return {Boolean} Is the dropdown currenctly opened?
 */
function isPublishDropDownOpened() {
    return browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents);
}

/**
 * Displays the contents of the publish dropdown if they are currenctly hidden.
 *
 * @return {Void}
 */
function showDropDown() {
    const isDropDownNotVisible = !isPublishDropDownOpened();

    if (isDropDownNotVisible) {
        browser.click(selectors.topBar.publishDropDown.btn);
    }
}

/**
 * Hides the contents of the publish dropdown if they are currenctly visible.
 *
 * @return {Void}
 */
function hideDropDown() {
    if (isPublishDropDownOpened()) {
        browser.click(selectors.topBar.publishDropDown.btn);
    }
}

module.exports = {
    reset,
    showDropDown,
    hideDropDown
};
