describe('TopBar.MenuToggler', () => {
    it('should display the offCanvas menu when clicked.', () => {
        browser.click('#neos__topBar__menuToggler');
        browser.pause(400);

        expect(browser.isVisibleWithinViewport('#neos__offCanvas')).to.equal(true);
    });

    it('should hide the offCanvas menu when clicked again.', () => {
        browser.click('#neos__topBar__menuToggler');
        browser.pause(400);

        expect(browser.isVisibleWithinViewport('#neos__offCanvas')).to.equal(false);
    });
});
