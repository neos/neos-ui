describe('TopBar.UserDropDown', () => {
    it('should initially hide the dropdown items.', () => {
        expect(browser.isVisibleWithinViewport('#neos__topBar__userDropDown__contents')).to.equal(false);
    });

    it('should display the dropdown items after the button was clicked.', () => {
        browser.click('#neos__topBar__userDropDown__btn');

        expect(browser.isVisibleWithinViewport('#neos__topBar__userDropDown__contents')).to.equal(true);
    });

    it('should hide the dropdown items after the button was clicked again.', () => {
        browser.click('#neos__topBar__userDropDown__btn');

        expect(browser.isVisibleWithinViewport('#neos__topBar__userDropDown__contents')).to.equal(false);
    });

    it('should hide the dropdown items if the user clicked outside of the dropdown.', () => {
        browser.click('#neos__topBar__userDropDown__btn');
        browser.click('#neos__contentView');

        expect(browser.isVisibleWithinViewport('#neos__topBar__userDropDown__contents')).to.equal(false);
    });
});
