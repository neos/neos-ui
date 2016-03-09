const {selectors} = __neosSelenium;
const addedText = `My added text v${Math.random()}`;

describe('Inline editing', () => {
    //
    // Reset the server state.
    //
    before(() => {
        // If the `Discard All` button is enabled, click and reset all local changes which where already synced to the server.
        // @todo: We should not rely on the functionality of the `Discard All` button.
        if (browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn)) {
            // Open the publish dropdown if it is not already opened.
            if (!browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)) {
                browser.click(selectors.topBar.publishDropDown.btn);
            }

            browser.click(selectors.topBar.publishDropDown.discardAllBtn);
            browser.pause(2000);

            // Hide the publish dropdown if it was opened.
            if (browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)) {
                browser.click(selectors.topBar.publishDropDown.btn);
            }
        }
    });

    // Make sure that each test starts in the Host frame.
    beforeEach(() => browser.frameParent());

    it('should be able to type into a nodeType in the guest frame.', () => {
        // Focus the guest frame and edit the first node property selenium can find in the DOM.
        browser.frame(browser.element(selectors.guestFrame.iframe).value)
            .click(selectors.guestFrame.inlineEditableNodeTypes)
            .pause(200);

        browser.keys(addedText)
            .click('body')

            // Wait a bit until the server request has finished.
            .pause(2000);

        expect(browser.elementIdText(browser.element(selectors.guestFrame.inlineEditableNodeTypes).value.ELEMENT).value).to.contain(addedText);
    });

    it('should persist the changes on the server after editing the nodeType in the guest frame and reloading the backend.', () => {
        browser.refresh().frame(browser.element(selectors.guestFrame.iframe).value)
            .waitUntil(() => {
                return browser.getText('#neos__topBar__publishDropDown__publishBtn').then((text) => {
                    return text === 'Published';
                });
            });

        expect(browser.elementIdText(browser.element(selectors.guestFrame.inlineEditableNodeTypes).value.ELEMENT).value).to.contain(addedText);
    });

    it('should be able to display the publish dropdown contents after the publish dropdown chevron was clicked.', () => {
        return browser.click(selectors.topBar.publishDropDown.btn)
            .isVisibleWithinViewport(selectors.topBar.publishDropDown.contents).should.equal(true);
    });

    it.skip('should reset all changes when clicking the discard button.', () => {
        browser.click(selectors.topBar.publishDropDown.discardBtn)
            .pause(2000);

        browser.refresh()
            .frame(browser.element(selectors.guestFrame.iframe).value);

        expect(browser.elementIdText(browser.element(selectors.guestFrame.inlineEditableNodeTypes).value.ELEMENT).value).to.not.contain(addedText);
    });
});
