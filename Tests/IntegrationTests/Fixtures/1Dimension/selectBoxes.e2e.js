import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, checkPropTypes, subSection} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Select Boxes`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('SelectBox opens below and breaks out of the creation dialog if there\'s enough space below.', async t => {
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').withText('SelectBox opens below and breaks out'))
        .click(ReactSelector('NodeCreationDialog SelectBox'));

    subSection('SelectBox contents open below the SelectBox.');
    await t
        .expect(await ReactSelector('NodeCreationDialog SelectBox ShallowDropDownContents').getBoundingClientRectProperty('top'))
        .gt(await ReactSelector('NodeCreationDialog SelectBox').getBoundingClientRectProperty('top'));
});

test('SelectBox opens above in creation dialog if there\'s not enough space below.', async t => {
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').withText('SelectBox opens above'))
        .click(ReactSelector('NodeCreationDialog SelectBox'));

    subSection('SelectBox contents open above if the SelectBox is just above the screen bottom.');
    await t
        .expect(await ReactSelector('NodeCreationDialog SelectBox ShallowDropDownContents').getBoundingClientRectProperty('top'))
        .lt(await ReactSelector('NodeCreationDialog SelectBox').getBoundingClientRectProperty('top'));
    await t
        .expect(await ReactSelector('NodeCreationDialog SelectBox ShallowDropDownContents').getStyleProperty('display'))
        .eql('block');

    subSection('SelectBox contents disappear when SelectBox is scrolled out of sight.');
    await t.hover(Selector('#neos-NodeCreationDialog [for="__neos__editor__property---title"]'));

    await t
        .expect(await ReactSelector('NodeCreationDialog SelectBox ShallowDropDownContents').getStyleProperty('display'))
        .eql('none');
});

test('SelectBox opens above in inspector if there\'s not enough space below.', async t => {
    await t.click(Page.treeNode.withExactText('SelectBox opens above in Inspector'))
    await Page.waitForIframeLoading(t);
    await t.click(ReactSelector('Inspector Panel SelectBox'));

    subSection('SelectBox contents open above if the SelectBox is just above the screen bottom.');
    await t
        .expect(await ReactSelector('Inspector Panel SelectBox ShallowDropDownContents').getBoundingClientRectProperty('top'))
        .lt(await ReactSelector('Inspector Panel SelectBox').getBoundingClientRectProperty('top'));


    subSection('When the inspector tab panel is scrolled just enough, so that there\'s enough space, SelectBox contents jump below the SelectBox.');
    await t.hover(Selector('[for="__neos__editor__property---uriPathSegment"]'));

    await t
        .expect(await ReactSelector('Inspector Panel SelectBox ShallowDropDownContents').getBoundingClientRectProperty('top'))
        .gt(await ReactSelector('Inspector Panel SelectBox').getBoundingClientRectProperty('top'));
});
