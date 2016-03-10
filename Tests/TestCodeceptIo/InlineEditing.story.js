
Feature('Inline editing');


Scenario('should be able to type into a nodeType in the guest frame.', (I) => {
    I.amOnPage('/che!/');
    I.fillField('#username', 'admin');
    I.fillField('#password', 'password');
    I.click('//*[@id="neos-login-box"]/div/form/fieldset/div[3]/button[1]');
    I.waitForElement('#appContainer', 30);

    I.amOnPage('/che!/');
    I.seeElement({id: 'appContainer'});

    I.waitForElement({css: '#neos__contentView iframe'}, 30);
    I.focusAndEditInGuestFrame('Hello Worlds');
});

Scenario('should be able to display the publish dropdown contents after the publish dropdown chevron was clicked.', (I) => {
    I.amOnPage('/che!/');
    I.fillField('#username', 'admin');
    I.fillField('#password', 'password');
    I.click('//*[@id="neos-login-box"]/div/form/fieldset/div[3]/button[1]');
    I.waitForElement('#appContainer', 30);


    I.dontSeeElementInViewport('#neos__topBar__publishDropDown__contents');
    I.click('#neos__topBar__publishDropDown__btn');
    I.seeElementInViewport('#neos__topBar__publishDropDown__contents');

});
