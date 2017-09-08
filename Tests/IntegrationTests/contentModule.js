import {Selector, Role} from 'testcafe';
import ReactSelector from 'testcafe-react-selectors';

const section = name => console.log('\x1b[44m%s\x1b[0m', name);
const subSection = name => console.log('\x1b[33m%s\x1b[0m', ' - ' + name);

/* global fixture:true */
/* eslint babel/new-cap: 0 */

const adminUrl = 'http://127.0.0.1:8081/neos!';

const adminUser = Role(adminUrl, async t => {
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'password')
        .click('button.neos-login-btn');
}, {preserveUrl: true});

fixture `Content Module`
    .beforeEach(async t => {
        await t.useRole(adminUser);
    });

test('All tests at once', async t => {
    section('PageTree search and filter');
    subSection('Search the page tree');
    const nodeTreeSearchInput = ReactSelector('NodeTreeSearchInput');
    const treeNode = ReactSelector('Node').find('span');
    const nodeTreeFilter = ReactSelector('NodeTreeFilter');
    const shortcutFilter = ReactSelector('NodeTreeFilter').find('li').withText('Shortcut');
    await t
        .typeText(nodeTreeSearchInput, 'Download')
        .expect(treeNode.withText('Download').count).eql(2, 'Two "Download" nodes should be found, on shortcut and one normal page')
        .expect(treeNode.withText('Try me').exists).notOk('Top level "Try me" page should be hidden ');
    subSection('Set the Shortcut filter');
    await t
        .click(nodeTreeFilter)
        .click(shortcutFilter)
        .expect(treeNode.withText('Download').count).eql(1, 'Only one "Download" page should be found, of type Shortcut')
        .expect(treeNode.withText('Shortcut to child node').exists).notOk('No matching "Shortcut" pages should be hidden')
        .expect(treeNode.withText('Try me').exists).notOk('Top level "Try me" page should still be hidden');
    subSection('Clear search');
    const clearSearch = ReactSelector('NodeTreeSearchInput IconButton');
    await t
        .click(clearSearch)
        .expect(treeNode.withText('Shortcut to child node').exists).ok('All "Shortcut" pages should be found')
        .expect(treeNode.withText('Try me').exists).notOk('Top level "Try me" page should still be hidden');
    subSection('Clear filter');
    const clearFilter = ReactSelector('NodeTreeFilter Button');
    await t
        .click(clearFilter)
        .expect(treeNode.withText('Shortcut to child node').exists).notOk('Deep Shortcut pages should be hidden')
        .expect(treeNode.withText('Try me').exists).ok('Top level "Try me" page should shown again');

    section('Can toggle leftSideBar');
    const leftSideBarToggler = ReactSelector('LeftSideBarToggler Button');
    const leftSideBar = ReactSelector('LeftSideBar');
    await t
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);

    section('Can toggle rightSideBar');
    const rightSideBarToggler = ReactSelector('RightSideBar Button');
    const rightSideBar = ReactSelector('RightSideBar');
    await t
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);

    section('Can create a new page');
    const SelectNodeTypeModal = ReactSelector('SelectNodeType');
    const newPageTitle = 'TestPage';
    await t
        .expect(SelectNodeTypeModal.exists).ok()
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false)
        .click(ReactSelector('AddNode Button'))
        .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true)
        .click(ReactSelector('NodeTypeItem'))
        .click(ReactSelector('BackButton'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(ReactSelector('NodeCreationDialogBody TextField').find('input'), newPageTitle)
        .click(ReactSelector('CreateButton'))
        .expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('li').withText(newPageTitle).exists).ok()
        .switchToMainWindow();

    section('Can create content node from inside InlineUI');
    const headlineTitle = 'Helloworld!';
    await t
        .switchToIframe('[name="neos-content-main"]')
        .click(Selector('.neos-contentcollection'))
        .click(ReactSelector('AddNode Button'))
        .switchToMainWindow()
        .click(Selector('button#into'))
        // TODO: this selector will only work with English translation.
        // Change to `withProps` when implemented: https://github.com/DevExpress/testcafe-react-selectors/issues/14
        .click(ReactSelector('NodeTypeItem').find('button').withText('Headline'))
        .switchToIframe('[name="neos-content-main"]')
        .typeText(Selector('.neos-inline-editable h1'), headlineTitle)
        // Weird bug here, if I use `('.neos-inline-editable h1')` selector it fails
        .expect(Selector('.neos-contentcollection').withText(headlineTitle).exists).ok()
        .switchToMainWindow();
});
