const selectors = __neosSelenium.selectors;

describe('LeftSideBar.NodeTreeToolBar.AddNode', () => {
    it('should open the "addNode" modal when clicked.', () => {
        browser.click(selectors.leftSideBar.nodeTreeToolBar.addNode);

        expect(browser.isVisible(selectors.modals.addNode)).to.equal(true);
    });

    it('should close the "addNode" modal when clicking the closeModal button.', () => {
        browser.click('#neos__modal__closeModal');

        expect(browser.isVisible('#neos__addNodeModal')).to.equal(false);
    });
});
