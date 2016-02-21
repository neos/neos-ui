describe('TopBar.OffCavnas', () => {
    it('should hide the offCanvas menu when the UAs mouse is leaving its boundaries.', () => {
        browser.click('#neos__topBar__menuToggler');
        browser.pause(500);

        browser.moveToObject('#neos__offCanvas');
        browser.moveTo(null, 999, 999);
        browser.pause(1000);

        expect(browser.isVisibleWithinViewport('#neos__offCanvas')).to.equal(false);
    });
});
