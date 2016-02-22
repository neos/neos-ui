const {selectors} = __neosSelenium;

describe('User interface', () => {
    //
    // OffCanvas
    //
    it('should display the offCanvas menu when clicking the `Navigation` button in the TopBar.', () => {
        browser.click(selectors.topBar.menuToggler);
        browser.pause(400);

        expect(browser.isVisibleWithinViewport(selectors.offCanvas)).to.equal(true);
    });

    it('should hide the offCanvas menu when clicking the `Navigation` button in the TopBar a second time.', () => {
        browser.click(selectors.topBar.menuToggler);
        browser.pause(400);

        expect(browser.isVisibleWithinViewport(selectors.offCanvas)).to.equal(false);
    });

    it('should hide the offCanvas menu when the UAs mouse is leaving its boundaries.', () => {
        browser.click(selectors.topBar.menuToggler);
        browser.pause(500);

        browser.moveToObject(selectors.offCanvas);
        browser.moveTo(null, 999, 999);
        browser.pause(1000);

        expect(browser.isVisibleWithinViewport(selectors.offCanvas)).to.equal(false);
    });

    //
    // Left Sidebar (`Navigate`)
    //
    it('should hide the left sidebar when clicking the `Navigate` button in the TopBar.', () => {
        browser.click(selectors.topBar.leftSideBarToggler);
        browser.pause(400);

        expect(browser.isVisibleWithinViewport(selectors.leftSideBar.container)).to.equal(false);
    });

    it('should display the left sidebar when clicked again.', () => {
        browser.click(selectors.topBar.leftSideBarToggler);
        browser.pause(400);

        expect(browser.isVisibleWithinViewport(selectors.leftSideBar.container)).to.equal(true);
    });

    //
    // User dropdown
    //
    it('should display the user dropdown contents after the `User` button was clicked.', () => {
        browser.click(selectors.topBar.userDropDown.btn);

        expect(browser.isVisibleWithinViewport(selectors.topBar.userDropDown.contents)).to.equal(true);
    });

    it('should hide the user dropdown contents after the `User` button was clicked again.', () => {
        browser.click(selectors.topBar.userDropDown.btn);

        expect(browser.isVisibleWithinViewport(selectors.topBar.userDropDown.contents)).to.equal(false);
    });

    it('should hide the dropdown items if the user clicked outside of the dropdown.', () => {
        browser.click(selectors.topBar.userDropDown.btn);
        browser.click(selectors.contentView);

        expect(browser.isVisibleWithinViewport(selectors.topBar.userDropDown.contents)).to.equal(false);
    });

    //
    // Right Sidebar (`Inspector`)
    //
    it('should hide the right sidebar when clicking the chevron button.', () => {
        browser.click(selectors.rightSideBar.toggler);
        browser.pause(500);

        expect(browser.isVisibleWithinViewport(selectors.rightSideBar.container)).to.equal(false);
    });

    it('should show the right sidebar when clicking the chevron button again.', () => {
        browser.click(selectors.rightSideBar.toggler);
        browser.pause(500);

        expect(browser.isVisibleWithinViewport(selectors.rightSideBar.container)).to.equal(true);
    });
});
