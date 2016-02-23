const {selectors} = __neosSelenium;

describe('User interface', () => {
    //
    // OffCanvas
    //
    it('should display the offCanvas menu when clicking the `Navigation` button in the TopBar.', () => {
        browser.click(selectors.topBar.menuToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.offCanvas).should.equal(true);
    });

    it('should hide the offCanvas menu when clicking the `Navigation` button in the TopBar a second time.', () => {
        browser.click(selectors.topBar.menuToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.offCanvas).should.equal(false);
    });

    it('should hide the offCanvas menu when the UAs mouse is leaving its boundaries.', () => {
        browser.click(selectors.topBar.menuToggler)
            .pause(500);

        browser.moveToObject(selectors.offCanvas)
            .moveTo(null, 999, 999)
            .pause(1000);

        return browser.isVisibleWithinViewport(selectors.offCanvas).should.equal(false);
    });

    //
    // Left Sidebar (`Navigate`)
    //
    it('should hide the left sidebar when clicking the `Navigate` button in the TopBar.', () => {
        browser.click(selectors.topBar.leftSideBarToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.leftSideBar.container).should.equal(false);
    });

    it('should display the left sidebar when clicked again.', () => {
        browser.click(selectors.topBar.leftSideBarToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.leftSideBar.container).should.equal(true);
    });

    //
    // User dropdown
    //
    it('should display the user dropdown contents after the `User` button was clicked.', () => {
        browser.click(selectors.topBar.userDropDown.btn);

        return browser.isVisibleWithinViewport(selectors.topBar.userDropDown.contents).should.equal(true);
    });

    it('should hide the user dropdown contents after the `User` button was clicked again.', () => {
        browser.click(selectors.topBar.userDropDown.btn);

        return browser.isVisibleWithinViewport(selectors.topBar.userDropDown.contents).should.equal(false);
    });

    it('should hide the dropdown items if the user clicked outside of the dropdown.', () => {
        browser.click(selectors.topBar.userDropDown.btn)
            .click(selectors.contentView);

        return browser.isVisibleWithinViewport(selectors.topBar.userDropDown.contents).should.equal(false);
    });

    //
    // Right Sidebar (`Inspector`)
    //
    it('should hide the right sidebar when clicking the chevron button.', () => {
        browser.click(selectors.rightSideBar.toggler)
            .pause(500);

        return browser.isVisibleWithinViewport(selectors.rightSideBar.container).should.equal(false);
    });

    it('should show the right sidebar when clicking the chevron button again.', () => {
        browser.click(selectors.rightSideBar.toggler)
            .pause(500);

        return browser.isVisibleWithinViewport(selectors.rightSideBar.container).should.equal(true);
    });
});
