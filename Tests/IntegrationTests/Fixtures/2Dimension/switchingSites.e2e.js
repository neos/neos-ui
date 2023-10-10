import {subSection, checkPropTypes, getUrl, adminUserOnOneDimensionTestSite} from './../../utils';
import {Selector} from 'testcafe';
import {waitForReact} from 'testcafe-react-selectors';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Switching sites`
    .afterEach(() => checkPropTypes());

test('Switching from Neos.Test.OneDimension to Neos.Test.TwoDimensions and back', async t => {
    subSection('Log in @ Neos.Test.OneDimension');
    await t.navigateTo('http://onedimension.localhost:8081/neos');
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'admin')
        .click('button.neos-login-btn');
    await waitForReact(30000);
    await Page.goToPage('Home');

    subSection('Switch to Neos.Test.TwoDimensions via main menu');
    await t.click(Selector('#neos-MenuToggler'));
    await t.click(Selector('[href*="twodimensions"]'));

    await t.expect(getUrl()).contains('twodimensions.localhost', 'Switch to Neos.Test.TwoDimensions was successful');

    subSection('Switch back to Neos.Test.OneDimension via main menu');
    await waitForReact(30000);
    await Page.goToPage('Home');
    await t.click(Selector('#neos-MenuToggler'));
    await t.click(Selector('[href*="onedimension"]'));

    await t.expect(getUrl()).contains('onedimension.localhost', 'Switch to Neos.Test.OneDimension was successful');
});

test('Switching from Neos.Test.TwoDimensions to Neos.Test.OneDimension and back', async t => {
    subSection('Log in @ Neos.Test.TwoDimensions');
    await t.navigateTo('http://twodimensions.localhost:8081/neos');
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'admin')
        .click('button.neos-login-btn');
    await waitForReact(30000);
    await Page.goToPage('Home');

    subSection('Switch to Neos.Test.OneDimension via main menu');
    await t.click(Selector('#neos-MenuToggler'));
    await t.click(Selector('[href*="onedimension"]'));

    await t.expect(getUrl()).contains('onedimension.localhost', 'Switch to Neos.Test.OneDimension was successful');

    subSection('Switch back to Neos.Test.TwoDimensions via main menu');
    await waitForReact(30000);
    await Page.goToPage('Home');
    await t.click(Selector('#neos-MenuToggler'));
    await t.click(Selector('[href*="twodimensions"]'));

    await t.expect(getUrl()).contains('twodimensions.localhost', 'Switch to Neos.Test.TwoDimensions was successful');
});
