const selectors = __neosSelenium.selectors;
const utils = __neosSelenium.utils;

describe('TopBar.Publish', () => {
    beforeEach(() => {
        utils.publishing.reset();
        utils.publishing.hideDropDown();
    });

    describe('"DropDown"', () => {
        it('should initially hide the dropdown items.', () => {
            expect(browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)).to.equal(false);
        });

        it('should display the dropdown items after the chevron was clicked.', () => {
            browser.click(selectors.topBar.publishDropDown.btn);

            expect(browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)).to.equal(true);
        });

        it('should hide the dropdown items after the button was clicked again.', () => {
            browser.click(selectors.topBar.publishDropDown.btn);
            browser.click(selectors.topBar.publishDropDown.btn);

            expect(browser.isVisibleWithinViewport(selectors.topBar.publishDropDown.contents)).to.equal(false);
        });
    });

    describe('"Publish" button', () => {
        it('should initially be disabled.', () => {
            expect(browser.isEnabled(selectors.topBar.publishDropDown.publishBtn)).to.equal(false);
        });

        it('should be enabled if changes where made to a nodeType in the iFrame.', () => {
            utils.focus.guestFrame();

            browser.click('[data-__che-property]').keys('dfdfdsfdsfdsfdsfsdf');

            utils.focus.hostFrame();
            browser.pause(4000);

            expect(browser.isEnabled(selectors.topBar.publishDropDown.publishBtn)).to.equal(true);
        });
    });

    describe('"Publish All" button', () => {
        it('should initially be disabled.', () => {
            expect(browser.isEnabled(selectors.topBar.publishDropDown.publishAllBtn)).to.equal(false);
        });
    });

    describe('"Discard" button', () => {
        it('should initially be disabled.', () => {
            expect(browser.isEnabled(selectors.topBar.publishDropDown.discardBtn)).to.equal(false);
        });
    });

    describe('"Discard All" button', () => {
        it('should initially be disabled.', () => {
            expect(browser.isEnabled(selectors.topBar.publishDropDown.discardAllBtn)).to.equal(false);
        });
    });

    describe('"Auto-Publish" checkbox', () => {
        it('should initially be un-checked.', () => {
            expect(browser.isSelected(selectors.topBar.publishDropDown.autoPublishingEnabledCheckbox)).to.equal(false);
        });
    });
});
