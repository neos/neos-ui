import {adminUser, subSection, checkPropTypes} from './../utils';
import Page from './../pageModel';

/* global fixture:true */
/* eslint babel/new-cap: 0 */
export const page = new Page();

fixture`Switching dimensions`
    .beforeEach(async t => {
        await t.useRole(adminUser);
        await page.discardAll();
        await page.goToPage('Home');
    })
    .afterEach(() => checkPropTypes());

test('Switching dimensions', async t => {
    subSection('Navigate to some inner page and switch dimension');
    const translatedPageName = 'Page 1';
    const otherPageName = 'Page 2';

    await page.goToPage(translatedPageName);
    await page.switchLanguageDimension('Latvian');
    await t.click('#neos-NodeVariantCreationDialog-CreateEmpty');
    await page.waitForIframeLoading();
    await t
        .expect(await page.getReduxState(state => state.cr.contentDimensions.active.language[0])).eql('lv', 'Dimension switched to Latvian')
        .expect(page.treeNode.withText(otherPageName).exists).notOk('Untranslated node gone from the tree');

    subSection('Switch back to original dimension');
    await page.switchLanguageDimension('English (US)');
    await page.waitForIframeLoading();
    await t
        .expect(await page.getReduxState(state => state.cr.contentDimensions.active.language[0])).eql('en_US', 'Dimension back to English')
        .expect(page.treeNode.withText(otherPageName).exists).ok('Untranslated node back in the tree');
});
