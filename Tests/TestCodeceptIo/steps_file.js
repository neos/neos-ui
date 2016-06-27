
'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor({
        login() {
            this.amOnPage('/neos!/');
            this.fillField('#username', 'admin');
            this.fillField('#password', 'password');
            this.click('//*[@id="neos-login-box"]/div/form/fieldset/div[3]/button[1]');
            this.waitForElement('#appContainer', 10);
        }
  });
};
