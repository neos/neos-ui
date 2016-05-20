const {selectors} = __neosSelenium;

describe('User interface', () => {
    //
    // Drawer
    //
    it('should display the drawer menu when clicking the `Navigation` button in the PrimaryToolbar.', () => {
        browser.click(selectors.primaryToolbar.menuToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.drawer).should.equal(true);
    });

    it('should hide the drawer menu when clicking the `Navigation` button in the PrimaryToolbar a second time.', () => {
        browser.click(selectors.primaryToolbar.menuToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.drawer).should.equal(false);
    });

    it('should hide the drawer menu when the UAs mouse is leaving its boundaries.', () => {
        browser.click(selectors.primaryToolbar.menuToggler)
            .pause(500);

        browser.moveToObject(selectors.drawer)
            .moveTo(null, 999, 999)
            .pause(1000);

        return browser.isVisibleWithinViewport(selectors.drawer).should.equal(false);
    });

    //
    // Left Sidebar (`Navigate`)
    //
    it('should hide the left sidebar when clicking the `Navigate` button in the PrimaryToolbar.', () => {
        browser.click(selectors.primaryToolbar.leftSideBarToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.leftSideBar.container).should.equal(false);
    });

    it('should display the left sidebar when clicked again.', () => {
        browser.click(selectors.primaryToolbar.leftSideBarToggler)
            .pause(400);

        return browser.isVisibleWithinViewport(selectors.leftSideBar.container).should.equal(true);
    });

    //
    // User dropdown
    //
    it('should display the user dropdown contents after the `User` button was clicked.', () => {
        browser.click(selectors.primaryToolbar.userDropDown.btn);

        return browser.isVisibleWithinViewport(selectors.primaryToolbar.userDropDown.contents).should.equal(true);
    });

    it('should hide the user dropdown contents after the `User` button was clicked again.', () => {
        browser.click(selectors.primaryToolbar.userDropDown.btn);

        return browser.isVisibleWithinViewport(selectors.primaryToolbar.userDropDown.contents).should.equal(false);
    });

    it('should hide the dropdown items if the user clicked outside of the dropdown.', () => {
        browser.click(selectors.primaryToolbar.userDropDown.btn)
            .click(selectors.contentCanvas);

        return browser.isVisibleWithinViewport(selectors.primaryToolbar.userDropDown.contents).should.equal(false);
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
