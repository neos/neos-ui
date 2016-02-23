const {selectors, keys} = __neosSelenium;
let beforeAddedText;
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

    // Make sure that each test starts in the Host frame.
    beforeEach(() => browser.frameParent());

    it('should initially hide the publish dropdown contents.', () => {
        return browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents).should.equal(false);
    });

    it('should initially mark the `Publish` button as disabled.', () => {
        return browser.isEnabled(selectors.topBar.publishDropDown.publishBtn).should.equal(false);
    });

    it('should initially mark the `Publish All` button as disabled.', () => {
        return browser.isEnabled(selectors.topBar.publishDropDown.publishAllBtn).should.equal(false);
    });

    it('should initially mark the `Discard` button as disabled.', () => {
        return browser.isEnabled(selectors.topBar.publishDropDown.discardBtn).should.equal(false);
    });

    it('should initially mark the `Discard All` button as disabled.', () => {
        return browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn).should.equal(false);
    });

    it('should display the publish dropdown contents after the publish dropdown chevron was clicked.', () => {
        return browser.click(selectors.topBar.publishDropDown.btn)
            .isVisibleWithinViewport(selectors.topBar.publishDropDown.contents).should.equal(true);
    });

    it('should hide the dropdown items after the button was clicked again.', () => {
        return browser.click(selectors.topBar.publishDropDown.btn)
            .isVisibleWithinViewport(selectors.topBar.publishDropDown.contents).should.equal(false);
    });

    it('should be able to type into a nodeType in the guest frame.', () => {
        addedText = `my added text ${Math.random()}`;

        // Focus the guest frame and edit the first node property selenium can find in the DOM.
        // @todo: We should find a better way to adress dom nodes which we can edit via selenium.
        browser.frame(browser.element(selectors.guestFrame.iframe).value);
        beforeAddedText = browser.getText(selectors.guestFrame.inlineEditableNodeTypes)[0];

        const result = browser.click(selectors.guestFrame.inlineEditableNodeTypes)
            .keys([keys.CTRL_CMD, 'a'])
            .keys([keys.CTRL_CMD, 'x'])
            .keys(addedText)
            .elementIdText(browser.element(selectors.guestFrame.inlineEditableNodeTypes).value.ELEMENT);

        expect(result.value).to.contain(addedText);

        browser.pause(2000);
    });

    it('should persist the changes on the server after editing the nodeType in the guest frame and reloading the backend.', () => {
        return browser.refresh()
            .frame(browser.element(selectors.guestFrame.iframe).value)
            .waitUntil(() => browser.getText(selectors.guestFrame.inlineEditableNodeTypes).then(res => res[0] === `x${addedText}`));
    });

    it('should reset all changes when clicking the discard button.', () => {
        return browser
            .click(selectors.topBar.publishDropDown.btn)
            .click(selectors.topBar.publishDropDown.discardBtn)
            .frame(browser.element(selectors.guestFrame.iframe).value)
            .waitUntil(() => browser.getText(selectors.guestFrame.inlineEditableNodeTypes).then(res => res[0] === beforeAddedText));
    });
});
