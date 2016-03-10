'use strict';
// use any assertion library you like
const chai = require('chai');
const expect = chai.expect;

class Neos extends Helper {

    // before/after hooks
    _before() {
        // remove if not used
    }

    _after() {
        // remove if not used
    }
    //todo split and make more flexible
    focusAndEditInGuestFrame(text) {
        // access current client of WebDriverIO helper
        const client = this.helpers['WebDriverIO'].browser;
        return client.frame('neos-content-main').click('.typo3-neos-nodetypes-text').keys(text);
    }

    dontSeeElementInViewport(selector) {
        // access current client of WebDriverIO helper
        const client = this.helpers['WebDriverIO'].browser;
        return client.isVisibleWithinViewport(selector).then((isVisible) => {
            expect(isVisible).to.be.false;
        });
    }

    seeElementInViewport(selector) {
        // access current client of WebDriverIO helper
        const client = this.helpers['WebDriverIO'].browser;
        return client.isVisibleWithinViewport(selector).then((isVisible) => {
            expect(isVisible).to.be.true;
        });
    }
}

module.exports = Frame;
