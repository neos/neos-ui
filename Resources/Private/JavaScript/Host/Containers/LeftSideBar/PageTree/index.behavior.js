describe('LeftSideBar.PageTree', () => {
    it('should be able to open child trees when clicking on an treeToggleChevron.', () => {
        const sizeBefore = browser.getElementSize('#neos__leftSidebar__pageTree');

        browser.click('#neos__leftSidebar__pageTree [data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle"]');
        browser.pause(1000);

        const sizeAfter = browser.getElementSize('#neos__leftSidebar__pageTree');

        expect(sizeAfter.height).to.be.above(sizeBefore.height);
    });

    it('should be able to close child trees when clicking on an treeToggleChevron.', () => {
        const sizeBefore = browser.getElementSize('#neos__leftSidebar__pageTree');

        browser.click('#neos__leftSidebar__pageTree [data-neos-integrational-test="tree__item__nodeHeader__subTreetoggle"]');
        browser.pause(1000);

        const sizeAfter = browser.getElementSize('#neos__leftSidebar__pageTree');

        expect(sizeAfter.height).to.be.below(sizeBefore.height);
    });

    it('should change to the given page when clicking on the name of a pagetree item.', () => {
        const srcBefore = browser.getAttribute('#neos__contentView iframe', 'src');

        browser.click('#neos__leftSidebar__pageTree [data-neos-integrational-test="tree__item__nodeHeader__itemLabel"]');
        browser.pause(1000);

        const srcAfter = browser.getAttribute('#neos__contentView iframe', 'src');

        expect(srcBefore).to.not.equal(srcAfter);
    });
});
