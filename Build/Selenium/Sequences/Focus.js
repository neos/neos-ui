/**
 * Sets the focus of the selenium driver to the guest iframe.
 *
 * @return {Void}
 */
function guestFrame() {
    browser.frame(browser.element('#neos__contentView iframe').value);
}

/**
 * Sets the focus of the selenium driver to the host frame.
 *
 * @return {Void}
 */
function hostFrame() {
    browser.frameParent();
}

module.exports = {
    hostFrame,
    guestFrame
};
