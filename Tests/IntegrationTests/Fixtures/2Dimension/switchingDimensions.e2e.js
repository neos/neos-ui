import {beforeEach, subSection, checkPropTypes} from './../../utils';
import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {
    Page
} from './../../pageModel';

/* global fixture:true */

fixture`Switching dimensions`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Switching dimensions', async t => {
    subSection('Navigate to some inner page and switch dimension');
    const translatedPageName = 'Translated page';
    const otherPageName = 'Untranslated page';

    await Page.goToPage(translatedPageName);
    await t
        .click(ReactSelector('DimensionSwitcher'))
        .click(ReactSelector('DimensionSelector').withProps('dimensionName', 'language'))
        .click(ReactSelector('DimensionSelectorOption').withProps('option', {
            value: 'da'
        }))
        .expect(ReactSelector('DimensionSelector').withProps({
            'dimensionName': 'country',
            'activePreset': 'dnk'
        }).exists).ok('Active country preset changed to first allowed value');
    await t
        .click(Selector('#neos-DimensionSwitcher-Apply'))
        .click('#neos-NodeVariantCreationDialog-CreateEmpty');
    await Page.waitForIframeLoading();
    await t
        .expect(await Page.getReduxState(state => state.cr.contentDimensions.active.language[0])).eql('da', 'Language switched to Danish')
        .expect(await Page.getReduxState(state => state.cr.contentDimensions.active.country[0])).eql('dnk', 'Country switched to Denmark')
        .expect(Page.treeNode.withText(otherPageName).exists).notOk('Untranslated node gone from the tree');

    subSection('Switch back to original dimension');
    await t
        .click(ReactSelector('DimensionSwitcher'))
        .click(ReactSelector('DimensionSelector').withProps('dimensionName', 'language'))
        .click(ReactSelector('DimensionSelectorOption').withProps('option', {
            value: 'en_US'
        }))
        .expect(ReactSelector('DimensionSelector').withProps({
            'dimensionName': 'country',
            'activePreset': 'deu'
        }).exists).ok('Active country preset changed to first allowed value');
    await t
        .click(Selector('#neos-DimensionSwitcher-Apply'));
    await Page.waitForIframeLoading();
    await t
        .expect(await Page.getReduxState(state => state.cr.contentDimensions.active.language[0])).eql('en_US', 'Language switched back to American English')
        .expect(await Page.getReduxState(state => state.cr.contentDimensions.active.country[0])).eql('deu', 'Country switched back to Germany')
        .expect(Page.treeNode.withText(otherPageName).exists).ok('Untranslated node back in the tree');
});
