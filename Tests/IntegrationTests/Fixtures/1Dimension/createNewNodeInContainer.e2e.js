import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes, typeTextInline} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Create new nodes`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Create a text node in a new container element at the correct position', async t => {
    console.log("hello world")

    await t.click(Selector('#neos-ContentTree-ToggleContentTree'));

    subSection('Create content collection node');
    await t
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button').withExactText('Container_Test'));
    await Page.waitForIframeLoading(t);

    subSection('Create text node in container');
    await t
        .click(Page.treeNode.withExactText('Container_Test'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(Selector('#into'))
        .click(ReactSelector('NodeTypeItem').find('button').withExactText('Text_Test'));
    await Page.waitForIframeLoading(t);

    await t.expect(Page.treeNode.withExactText('Text_Test').exists).ok();

    await t.switchToIframe('[name="neos-content-main"]');

    await t.expect(Selector('.test-text').count).eql(1)
    const textIsInWrap = Selector('.test-container .test-text').parent().hasClass('test-container__inner-wrap');
    await t.expect(textIsInWrap).ok();
    await t.switchToMainWindow();

    subSection('Edit new text node inline in container');
    await typeTextInline(t, '.test-text [contenteditable="true"]', 'my text', 'p');
    await t.expect(Selector('.test-text').innerText).eql('my text')
    await t.switchToMainWindow();

    subSection('Copy container with new text node');
    await t
        .click(Page.treeNode.withExactText('Container_Test'))
        .click(Selector('#neos-ContentTree-CopySelectedNode'))
        .click(Selector('#neos-ContentTree-PasteClipBoardNode'))
        .click(Selector('#neos-InsertModeDialog button#after'))
        .click(Selector('#neos-InsertModeModal-apply'))
    await Page.waitForIframeLoading(t);

    await t.expect(Page.treeNode.withExactText('Container_Test').count).eql(2);
    await t.expect(Page.treeNode.withText('Text_Test').count).eql(2);

    subSection('Edit copied text node inline');
    await typeTextInline(t, '.test-container:last-child .test-text [contenteditable="true"]', 'my copied text', 'p');
    await t.expect(Selector('.test-container:last-child .test-text').innerText).eql('my copied text');
    await t.expect(Selector('.test-container .test-text').innerText).eql('my text');
    await t.switchToMainWindow();
});
