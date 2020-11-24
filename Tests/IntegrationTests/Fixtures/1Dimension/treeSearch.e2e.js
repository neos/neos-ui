import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';
import {Page} from './../../pageModel';

/* global fixture:true */

fixture`Tree search`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('PageTree search and filter', async t => {
    subSection('Search the page tree');
    const seachTerm = 'Searchme';
    const notSearchedPage = 'Not searched page';
    const notSearchedShortcut = 'Not searched shortcut';
    const searchmePage = 'Searchme page';
    const searchmeShortcut = 'Searchme shortcut';

    const nodeTreeSearchToggler = ReactSelector('NodeTreeSearchBar IconButton');
    const nodeTreeSearchInput = ReactSelector('NodeTreeSearchInput');
    const nodeTreeFilter = ReactSelector('NodeTreeFilter');
    const shortcutFilter = ReactSelector('NodeTreeFilter ShallowDropDownContents').find('li').withText('Shortcut');
    await t
        .click(nodeTreeSearchToggler)
        .typeText(nodeTreeSearchInput, seachTerm)
        .expect(Page.treeNode.withText(seachTerm).count).eql(2, 'Two "Searchme" nodes should be found, one shortcut and one normal page')
        .expect(Page.treeNode.withText(notSearchedPage).exists).notOk('Other unsearched page should be hidden ');

    subSection('Set the Shortcut filter');
    await t
        .click(nodeTreeFilter)
        .click(shortcutFilter)
        .expect(Page.treeNode.withText(searchmeShortcut).count).eql(1, 'Only one "Searchme" page should be found, of type Shortcut')
        .expect(Page.treeNode.withText(searchmePage).exists).notOk('No matching "Shortcut" pages should be hidden')
        .expect(Page.treeNode.withText(notSearchedPage).exists).notOk('Other unsearched page should still be hidden');

    subSection('Clear search');
    const clearSearch = ReactSelector('NodeTreeSearchInput IconButton');
    await t
        .click(clearSearch)
        .expect(Page.treeNode.withText(notSearchedShortcut).exists).ok('All "Shortcut" pages should be found')
        .expect(Page.treeNode.withText(notSearchedPage).exists).notOk('Other unsearched page should still be hidden');

    subSection('Clear filter');
    const clearFilter = ReactSelector('NodeTreeFilter IconButton');
    await t
        .click(clearFilter)
        .expect(Page.treeNode.withText(notSearchedPage).exists).ok('Other unsearched page should shown again');
});

test('Pagetree search field can be toggled', async t => {
    subSection('Search is initially hidden and can be opened');
    const nodeTreeSearchToggler = ReactSelector('NodeTreeSearchBar IconButton');
    const nodeTreeSearchInput = ReactSelector('NodeTreeSearchInput');

    await t
        .click(nodeTreeSearchToggler)
        .expect(nodeTreeSearchInput.exists)
        .ok();

    subSection('Close the search input again');
    await t
        .click(nodeTreeSearchToggler)
        .expect(nodeTreeSearchInput.exists)
        .notOk();
});

test('Pagetree search field state is stored', async t => {
    subSection('Search is initially hidden and we open it');
    const nodeTreeSearchToggler = ReactSelector('NodeTreeSearchBar IconButton');
    const nodeTreeSearchInput = ReactSelector('NodeTreeSearchInput');

    await t
        .click(nodeTreeSearchToggler)
        .expect(nodeTreeSearchInput.exists)
        .ok();

    subSection('We reload the page');
    await t.eval(() => location.reload(true));
    await t.wait(5000);

    subSection('We expect to have a visible search field');
    await t
        .expect(nodeTreeSearchInput.exists)
        .ok();
});

test('Pagetree search field toggles on hotkey', async t => {
    subSection('Search is initially hidden and we open it with "t s"');
    const nodeTreeSearchInput = ReactSelector('NodeTreeSearchInput');

    await t
        .pressKey('t')
        .pressKey('s')
        .expect(nodeTreeSearchInput.exists)
        .ok();
});
