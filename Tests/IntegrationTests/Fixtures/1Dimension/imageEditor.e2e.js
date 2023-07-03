import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Image editor`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Can crop an image', async t => {
    await Page.waitForIframeLoading(t);

    await t.switchToIframe('[name="neos-content-main"]');
    const initialImage = await Selector('.test-page-image').getAttribute('src');
    await t.switchToMainWindow();

    const imageEditor = await ReactSelector('InspectorEditorEnvelope').withProps('id', 'image');
    await t
        .click(imageEditor.findReact('IconButton').withProps('icon', 'crop'));
    const initialTopOffset = await imageEditor.find('img').getStyleProperty('top');

    // Crop the image
    await t.drag(ReactSelector('ReactCrop'), 50, 50, {offsetX: 5, offsetY: 5});

    // Verify that there's no z-index interference between the secondary
    // inspector and the "unapplied changes"-overlay
    await t.click(ReactSelector('SecondaryInspector'));
    await t.expect(Selector("#neos-UnappliedChangesDialog").exists).notOk();

    await t
        .expect(imageEditor.find('img').getStyleProperty('top')).notEql(initialTopOffset, 'The preview image should reflect the cropping results')
        .click(Selector('#neos-Inspector-Apply'));

    await Page.waitForIframeLoading(t);
    await t.switchToIframe('[name="neos-content-main"]');
    await t.expect(Selector('.test-page-image').getAttribute('src')).notEql(initialImage, 'Header image should have changed after crop');
    await t.switchToMainWindow();
});
