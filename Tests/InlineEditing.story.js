const {selectors, keys} = __neosSelenium;
let addedText;

describe('Inline editing', () => {
    //
    // Reset the server state.
    //
    before(() => {
        // Open the publish dropdown if it is not already opened.
        if (!browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)) {
            browser.click(selectors.topBar.publishDropDown.btn);
        }

        // If the `Discard All` button is enabled, click and reset all local changes which where already synced to the server.
        // @todo: We should not rely on the functionality of the `Discard All` button.
        if (browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn)) {
            browser.click(selectors.topBar.publishDropDown.discardAllBtn);
            browser.pause(4000);
        }

        // Hide the publish dropdown if it was opened.
        if (browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)) {
            browser.click(selectors.topBar.publishDropDown.btn);
        }
    });

    it('should initially hide the publish dropdown contents.', () => {
        expect(browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)).to.equal(false);
    });

    it('should initially mark the publish and discard buttons as disabled.', () => {
        expect(browser.isEnabled(selectors.topBar.publishDropDown.publishBtn)).to.equal(false);
        expect(browser.isEnabled(selectors.topBar.publishDropDown.publishAllBtn)).to.equal(false);
        expect(browser.isEnabled(selectors.topBar.publishDropDown.discardBtn)).to.equal(false);
        expect(browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn)).to.equal(false);
        expect(browser.isSelected(selectors.topBar.publishDropDown.autoPublishingEnabledCheckbox)).to.equal(false);
    });

    it('should display the publish dropdown contents after the publish dropdown chevron was clicked.', () => {
        browser.click(selectors.topBar.publishDropDown.btn);

        expect(browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)).to.equal(true);
    });

    it('should hide the dropdown items after the button was clicked again.', () => {
        browser.click(selectors.topBar.publishDropDown.btn);

        expect(browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)).to.equal(false);
    });

    it('should be able to type into a nodeType in the guest frame.', () => {
        const id = Math.random();

        addedText = `my added text ${id}`;

        // Focus the guest frame and edit the first node property selenium can find in the DOM.
        // @todo: We should find a better way to adress dom nodes which we can edit via selenium.
        browser.frame(browser.element(selectors.guestFrame.iframe).value);
        browser.click(selectors.guestFrame.inlineEditableNodeTypes).keys([keys.CTRL_CMD, 'a']).keys([keys.CTRL_CMD, 'x']).keys(addedText);

        expect(browser.getText(selectors.guestFrame.inlineEditableNodeTypes)[0]).to.contain(addedText);

        // Switch back to the host frame.
        browser.frameParent();
        browser.pause(2000);
    });

    it('should persist the changes on the server after editing the nodeType in the guest frame.', () => {
        // Reload the page.
        browser.url(browser.getUrl());
        browser.pause(2000);

        // Evaluate the contents of the previously changed node.
        browser.frame(browser.element(selectors.guestFrame.iframe).value);
        expect(browser.getText(selectors.guestFrame.inlineEditableNodeTypes)[0]).to.contain(addedText);

        // Switch back to the host frame.
        browser.frameParent();
    });

    it('should enable the publish and discard buttons if changes where made to a nodeType in the guest frame.', () => {
        expect(browser.isEnabled(selectors.topBar.publishDropDown.publishBtn)).to.equal(true);
        expect(browser.isEnabled(selectors.topBar.publishDropDown.publishAllBtn)).to.equal(true);
        expect(browser.isEnabled(selectors.topBar.publishDropDown.discardBtn)).to.equal(true);
        expect(browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn)).to.equal(true);
    });

    it('should reset all changes when clicking the discard button.', () => {
        browser.click(selectors.topBar.publishDropDown.btn);
        browser.click(selectors.topBar.publishDropDown.discardBtn);
        browser.pause(4000);

        // Evaluate that the contents have been restored to the original values.
        browser.frame(browser.element(selectors.guestFrame.iframe).value);
        expect(browser.getText(selectors.guestFrame.inlineEditableNodeTypes)[0]).to.not.contain(addedText);

        // Switch back to the host frame.
        browser.frameParent();
        browser.click(selectors.topBar.publishDropDown.btn);
    });
});
