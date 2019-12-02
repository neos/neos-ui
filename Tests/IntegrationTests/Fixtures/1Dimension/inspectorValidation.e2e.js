import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`InspectorValidation`.beforeEach(beforeEach).afterEach(() => checkPropTypes());

const InspectorTitleProperty = Selector(
    '#__neos__editor__property---title'
);
const InspectorUriPathSegmentProperty = Selector(
    '#__neos__editor__property---uriPathSegment'
);
const activeTabMenuItem = ReactSelector('TabMenuItem').withProps('isActive', true);

test('Remove homepage title to get one error', async t => {
    await Page.waitForIframeLoading(t);

    subSection('Remove homepage title');
    await t
        .typeText(InspectorTitleProperty, ' ', {replace: true})
        .pressKey('backspace')
        .expect(InspectorTitleProperty.value).eql('');

    subSection('Check error badge for one error');
    const badge = await activeTabMenuItem.findReact('Badge');
    await t
        .expect(await badge.getReact(({props}) => props.label))
        .eql('1', 'The badge shows one validation error in Props');
});

test('Remove homepage title and URI segment to get two errors', async t => {
    subSection('Clean title and uri path segment field');
    await t
        .typeText(InspectorTitleProperty, ' ', {replace: true})
        .pressKey('backspace')
        .typeText(InspectorUriPathSegmentProperty, ' ', {replace: true})
        .pressKey('backspace');

    subSection('Check error badge for two errors');
    const badge = await activeTabMenuItem.findReact('Badge');
    await t
        .expect(await badge.getReact(({props}) => props.label))
        .eql('2', 'The badge shows two validation errors in Props');
});

test('Remove homepage title to get one error and resolve error by new title', async t => {
    subSection('Remove homepage title');
    await t
        .typeText(InspectorTitleProperty, ' ', {replace: true})
        .pressKey('backspace')
        .expect(InspectorTitleProperty.value).eql('');

    subSection('Check error badge for one error');
    let badge = await activeTabMenuItem.findReact('Badge');
    await t
        .expect(await badge.getReact(({props}) => props.label))
        .eql('1', 'The badge shows one validation error in Props');

    subSection('Enter new title Home');
    await t
        .typeText(InspectorTitleProperty, 'Home', {replace: true});
    badge = await activeTabMenuItem.findReact('Badge');
    await t
        .expect(await badge.getReact(({props}) => props.label))
        .eql(null, 'The badge is not existing');
});
