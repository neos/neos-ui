import {t, Role, ClientFunction, Selector} from 'testcafe';
import {waitForReact} from 'testcafe-react-selectors';
import {PublishDropDown, Page} from './pageModel';
import {forEach} from "../../.yarn/releases/yarn-3.2.0";

export const subSection = name => console.log('\x1b[33m%s\x1b[0m', ' - ' + name);

const adminUserName = 'admin';
const adminPassword = 'admin';
const editorUserName = 'editor';
const editorPassword = 'editor';

export const getUrl = ClientFunction(() => window.location.href);

export const adminUserOnOneDimensionTestSite = Role('http://onedimension.localhost:8081/neos', async t => {
    await t
        .typeText('#username', adminUserName)
        .typeText('#password', adminPassword)
        .click('button.neos-login-btn');

    await t.expect(getUrl()).contains('/content');

    await waitForReact(30000);
    await Page.waitForIframeLoading();
}, {preserveUrl: true});

export const editorUserOnOneDimensionTestSite = Role('http://onedimension.localhost:8081/neos', async t => {
    await t
        .typeText('#username', editorUserName)
        .typeText('#password', editorPassword)
        .click('button.neos-login-btn');

    await t.expect(getUrl()).contains('/content');

    await waitForReact(30000);
    await Page.waitForIframeLoading();
}, {preserveUrl: true});

export const adminUserOnTwoDimensionsTestSite = Role('http://twodimensions.localhost:8081/neos', async t => {
    await t
        .typeText('#username', adminUserName)
        .typeText('#password', adminPassword)
        .click('button.neos-login-btn');

    await t.expect(getUrl()).contains('/content');

    await waitForReact(30000);
    await Page.waitForIframeLoading();
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
    await t.useRole(adminUserOnOneDimensionTestSite);
    await waitForReact(30000);
    await PublishDropDown.discardAll();
    if (await Selector('#neos-DiscardDialog-Acknowledge').exists) {
        await t.click(Selector('#neos-DiscardDialog-Acknowledge'));
    }
    await Page.goToPage('Home');
}

// This is a workaround for the fact that the contenteditable element is not directly selectable
// for more information see https://testcafe.io/documentation/402688/reference/test-api/testcontroller/selecteditablecontent
export async function typeTextInline(t, selector, text, textType, switchToIframe = true) {
    await waitForReact(30000);
    await Page.waitForIframeLoading();

    const textTypeToTagMap = {
        paragraph: 'p',
        heading1: 'h1',
        heading2: 'h2',
        heading3: 'h3',
        heading4: 'h4'
    };

    if (!Object.keys(textTypeToTagMap).includes(textType)) {
        textType = 'paragraph';
    }

    const tagName = textTypeToTagMap[textType] || '';
    try {
        const contentIframeSelector = Selector('[name="neos-content-main"]', {timeout: 2000});

        if (switchToIframe) {
            await t.switchToIframe(contentIframeSelector);
        }

        await t.eval(() => {
            const element = window.document.querySelector(selector);
            const editor = element.closest('.ck-editor__editable');
            const content = tagName !== '' ? `<${tagName}>${text}</${tagName}>` : text;
            editor.ckeditorInstance.data.set(content);
        },
            {dependencies: {selector, text, tagName}}
        );
    } catch (e) {
        // console.log(e);
    }
}

export async function clearInlineText(t, selector, switchToIframe = true) {
    await waitForReact(30000);
    await Page.waitForIframeLoading();

    try {
        const contentIframeSelector = Selector('[name="neos-content-main"]', {timeout: 2000});
        const lastEditableElement = selector;
        if (switchToIframe) {
            await t.switchToIframe(contentIframeSelector);
        }

        await t
            .selectEditableContent(lastEditableElement, lastEditableElement)
            .pressKey('ctrl+a delete');
    } catch (e) {
        // console.log(e);
    }
}
