import { Selector } from "testcafe";
import { beforeEach, subSection, checkPropTypes } from "./../../utils.js";
import { Page } from "./../../pageModel";

/* global fixture:true */

fixture`Inspector`.beforeEach(beforeEach).afterEach(() => checkPropTypes());

test("Can edit the page title via inspector", async t => {
    const InspectorTitleProperty = Selector(
        "#__neos__editor__property---title"
    );
    const InspectorUriPathSegmentProperty = Selector(
        "#__neos__editor__property---uriPathSegment"
    );
    await Page.waitForIframeLoading(t);

    subSection("Rename home page via inspector");
    await t
        .expect(InspectorTitleProperty.value)
        .eql("Home")
        .expect(InspectorUriPathSegmentProperty.value)
        .eql("home")
        .click(InspectorTitleProperty)
        .typeText(InspectorTitleProperty, "-привет!")
        .expect(InspectorTitleProperty.value)
        .eql("Home-привет!")
        .click(Selector("#neos-UriPathSegmentEditor-sync"))
        .expect(InspectorUriPathSegmentProperty.value)
        .eql("home-privet")
        .click(Selector("#neos-Inspector-Discard"))
        .expect(InspectorTitleProperty.value)
        .eql("Home")
        .typeText(InspectorTitleProperty, "-1")
        .click(Selector("#neos-Inspector-Apply"))
        .expect(InspectorTitleProperty.value)
        .eql("Home-1");
    await Page.waitForIframeLoading(t);
    await t.expect(InspectorTitleProperty.value).eql("Home-1");

    subSection("Test unapplied changes dialog - resume");
    await t
        .click(InspectorTitleProperty)
        .typeText(InspectorTitleProperty, "-2")
        .click(Selector('[name="neos-content-main"]'))
        .expect(Selector("#neos-UnappliedChangesDialog").exists)
        .ok()
        .click(Selector("#neos-UnappliedChangesDialog-resume"))
        .expect(Selector("#neos-UnappliedChangesDialog").exists)
        .notOk()
        .expect(InspectorTitleProperty.value)
        .eql("Home-1-2");

    subSection("Test unapplied changes dialog - discard");
    await t
        .click(Selector('[name="neos-content-main"]'))
        .click(Selector("#neos-UnappliedChangesDialog-discard"))
        .expect(InspectorTitleProperty.value)
        .eql("Home-1");

    subSection("Test unapplied changes dialog - apply");
    await t
        .typeText(InspectorTitleProperty, "-3")
        .click(Selector('[name="neos-content-main"]'))
        .click(Selector("#neos-UnappliedChangesDialog-apply"))
        .expect(InspectorTitleProperty.value)
        .eql("Home-1-3")
        .click(Selector('[name="neos-content-main"]'))
        .expect(Selector("#neos-UnappliedChangesDialog").exists)
        .notOk();
});
