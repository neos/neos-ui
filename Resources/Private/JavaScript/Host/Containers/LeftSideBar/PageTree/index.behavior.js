const wrapperSelector = '#neos__leftSidebar__pageTree';
const subTreeTogglerSelector = '#neos__leftSidebar__pageTree [data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle"]';
const itemNameSelector = '#neos__leftSidebar__pageTree [data-neos-integrational-test="tree__item__nodeHeader__itemLabel"]';

describe('LeftSideBar.PageTree', () => {
    it('should be able to open child trees when clicking on an treeToggleChevron.', () => {
        browser.waitForExist(subTreeTogglerSelector);

        const sizeBefore = browser.getElementSize(wrapperSelector);

        browser.click(subTreeTogglerSelector);
        browser.pause(1000);

        const sizeAfter = browser.getElementSize(wrapperSelector);

        expect(sizeAfter.height).to.be.above(sizeBefore.height);
    });

    it('should be able to close child trees when clicking on an treeToggleChevron.', () => {
        browser.waitForExist(subTreeTogglerSelector);

        const sizeBefore = browser.getElementSize(wrapperSelector);

        browser.click(subTreeTogglerSelector);
        browser.pause(1000);

        const sizeAfter = browser.getElementSize(wrapperSelector);

        expect(sizeAfter.height).to.be.below(sizeBefore.height);
    });

    it('should change to the given page when clicking on the name of a pagetree item.', () => {
        browser.waitForExist(subTreeTogglerSelector);

        const srcBefore = browser.getAttribute('#neos__contentView iframe', 'src');

        browser.click(itemNameSelector);
        browser.pause(1000);

        const srcAfter = browser.getAttribute('#neos__contentView iframe', 'src');

        expect(srcBefore).to.not.equal(srcAfter);
    });
});
