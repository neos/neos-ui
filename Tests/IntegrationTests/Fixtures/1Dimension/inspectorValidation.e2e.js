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
/** @type {Selector} */
const activeTabMenuItem = ReactSelector('TabMenuItem').withProps('isActive', true);

test('Remove homepage title to get one error', async t => {
    await Page.waitForIframeLoading(t);

    subSection('Remove homepage title');
    await t
        .typeText(InspectorTitleProperty, ' ', {replace: true})
        .pressKey('backspace')
        .expect(InspectorTitleProperty.value).eql('');

    subSection('Check error badge for one error');
    await t
        .expect(activeTabMenuItem.findReact('Badge').withProps('label', '1').exists)
        .ok('The badge shows one validation error in Props');
});

test('Remove Page title and URI segment to get two errors', async t => {
    await Page.goToPage('Discarding')
    subSection('Clean title and uri path segment field');
    await t
        .typeText(InspectorTitleProperty, ' ', {replace: true})
        .pressKey('backspace')
        .typeText(InspectorUriPathSegmentProperty, ' ', {replace: true})
        .pressKey('backspace');

    subSection('Check error badge for two errors');

    await t
        .expect(activeTabMenuItem.findReact('Badge').withProps('label', '2').exists)
        .ok('The badge shows two validation errors in Props');
});

test('Remove homepage title to get one error and resolve error by new title', async t => {
    subSection('Remove homepage title');
    await t
        .typeText(InspectorTitleProperty, ' ', {replace: true})
        .pressKey('backspace')
        .expect(InspectorTitleProperty.value).eql('');

    subSection('Check error badge for one error');
    await t
        .expect(activeTabMenuItem.findReact('Badge').withProps('label', '1').exists)
        .ok('The badge shows one validation error in Props');

    subSection('Enter new title Home');
    await t
        .typeText(InspectorTitleProperty, 'Home', {replace: true});

    await t
        .expect(activeTabMenuItem.findReact('Badge').exists).notOk('The badge is not existing')
});
