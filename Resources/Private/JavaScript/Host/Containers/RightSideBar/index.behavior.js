describe('TopBar.RightSideBar', () => {
    it('should hide the leftSideBar when clicking the toggler button.', () => {
        browser.click('#neos__rightSideBar__toggler');
        browser.pause(500);

        expect(browser.isVisibleWithinViewport('#neos__offCanvas')).to.equal(false);
    });

    it('should display the leftSideBar when clicking the toggler button again.', () => {
        browser.click('#neos__rightSideBar__toggler');
        browser.pause(500);

        expect(browser.getLocation('#neos__offCanvas').x).to.be.below(0);
    });
});
