
Feature('Inline editing');


Scenario('should be able to type into a nodeType in the guest frame.', (I) => {
    I.login();

    I.amOnPage('/che!/');

    I.waitForElement({css: '#neos__contentCanvas iframe'}, 30);
    I.focusAndEditInGuestFrame('Hello Worlds');
});

Scenario('should be able to display the publish dropdown contents after the publish dropdown chevron was clicked.', (I) => {
    I.login();

    I.dontSeeElementInViewport('#neos__topBar__publishDropDown__contents');
    I.click('#neos__topBar__publishDropDown__btn');
    I.seeElementInViewport('#neos__topBar__publishDropDown__contents');

});
