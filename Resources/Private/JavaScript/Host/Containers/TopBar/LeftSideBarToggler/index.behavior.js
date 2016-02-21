describe('TopBar.LeftSideBarToggler', () => {
    it('should hide the left sidebar when clicked.', () => {
        browser.click('#neos__topBar__leftSideBarToggler');
        browser.pause(400);

        expect(browser.isVisibleWithinViewport('#neos__leftSidebar')).to.equal(false);
    });

    it('should display the left sidebar when clicked again.', () => {
        browser.click('#neos__topBar__leftSideBarToggler');
        browser.pause(400);

        expect(browser.isVisibleWithinViewport('#neos__leftSidebar')).to.equal(true);
    });
});
