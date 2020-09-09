import {t, Role} from 'testcafe';
import {waitForReact} from 'testcafe-react-selectors';
import {PublishDropDown, Page} from './pageModel';

export const subSection = name => console.log('\x1b[33m%s\x1b[0m', ' - ' + name);

const adminUrl = 'http://127.0.0.1:8081/neos';
const adminUserName = 'admin';
const adminPassword = 'password';

export const adminUser = Role(adminUrl, async t => {
    await t
        .typeText('#username', adminUserName)
        .typeText('#password', adminPassword)
        .click('button.neos-login-btn');
}, {preserveUrl: true});

export async function checkPropTypes() {
    const {error} = await t.getBrowserConsoleMessages();
    // Quick fix hack to get rid of the react life cycle warnings
    if (error[0] && error[0].search('Warning: Unsafe legacy lifecycles') >= 0) {
        delete error[0];
    }
    if (error[0]) {
        console.log('These console errors were the cause of the failed test:', error);
    }
    await t.expect(error[0]).notOk();
}

export async function beforeEach(t) {
    await t.useRole(adminUser);
    await waitForReact(30000);
    await PublishDropDown.discardAll();
    await Page.goToPage('Home');
}
