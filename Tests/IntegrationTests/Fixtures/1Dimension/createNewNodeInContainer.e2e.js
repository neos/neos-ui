import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Create new nodes`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Create a text node in a new container element at the correct position', async t => {
    await t.switchToMainWindow();

    subSection('Create content collection node');
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Container_Test'));
    await Page.waitForIframeLoading(t);

    subSection('Create text node in container');
    await t
        .click(Page.treeNode.withText('Container'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(Selector('#into'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Text_Test'));
    await Page.waitForIframeLoading(t);

    await t.switchToIframe('[name="neos-content-main"]');

    const textIsInWrap = Selector('.test-container .test-text').parent().hasClass('test-container__inner-wrap');
    await t.expect(textIsInWrap).ok();
});
