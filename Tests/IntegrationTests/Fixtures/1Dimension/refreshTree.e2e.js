import {Selector} from 'testcafe';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Refresh Document Tree`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());


test('Refresh Document tree', async t => {
    const InspectorTitleProperty = Selector(
        "#__neos__editor__property---title"
    );

    await Page.waitForIframeLoading(t);
    await t.switchToMainWindow();

    subSection("Refresh the Document Tree and wait");
    await t.click(Selector('#neos-PageTree-RefreshPageTree'))
    await Page.waitForIframeLoading(t);

    // Rename the document to test if the inspector is available and works
    subSection("Rename home page via inspector");
    await t
        .expect(InspectorTitleProperty.value)
        .eql("Home")
        .click(InspectorTitleProperty)
        .typeText(InspectorTitleProperty, " is good")
        .expect(InspectorTitleProperty.value)
        .eql("Home is good")
        .click(Selector("#neos-Inspector-Apply"))
    await Page.waitForIframeLoading(t);
    await t.expect(InspectorTitleProperty.value).eql("Home is good");
});
