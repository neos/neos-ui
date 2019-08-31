import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Rich text editor`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Can crop an image', async t => {
    const testContent = 'Test RTE content';
    await Page.waitForIframeLoading(t);

    const rteInspectorEditor = await ReactSelector('InspectorEditorEnvelope').withProps('id', 'rte');
    const ckeContent = await Selector('.ck-content p');
    await t
        .click(rteInspectorEditor.findReact('Button'));
    await t
        .typeText(ckeContent, testContent)
        .wait(400)
        .click(Selector('#neos-Inspector-Apply'));
    await Page.waitForIframeLoading(t);
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('.test-page-rte').innerText).eql(testContent, 'Entered RTE content should have persisted');
    await t.switchToMainWindow();
});
