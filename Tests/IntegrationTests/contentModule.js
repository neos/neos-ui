import {Selector, Role} from 'testcafe';
import ReactSelector from 'testcafe-react-selectors';

import Page from './pageModel';

const section = async (name, testFunc) => {
    console.log('\x1b[44m%s\x1b[0m', name);
    await testFunc();
};
const subSection = name => console.log('\x1b[33m%s\x1b[0m', ' - ' + name);

/* global fixture:true */
/* eslint babel/new-cap: 0 */

const page = new Page();

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
    await section('Discarding: create a document node and then discard it', async () => {
        const pageTitleToCreate = 'DiscardTest';
        subSection('Create a document node');
        await t
            .click(ReactSelector('AddNode Button'))
            .click(ReactSelector('NodeTypeItem'))
            .typeText(Selector('#neos-nodeCreationDialog-body input'), pageTitleToCreate)
            .click(Selector('#neos-nodeCreationDialog-createNew'))
            .expect(page.treeNode.withText(pageTitleToCreate).exists).ok('Node with the given title appeared in the tree')
            .expect(ReactSelector('Provider').getReact(({props}) => {
                const reduxState = props.store.getState().toJS();
                return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
            })).gt(0, 'There are some unpublished nodes');
        subSection('Discard that node');
        await t
            .click(ReactSelector('PublishDropDown ContextDropDownHeader'))
            .click(ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Discard All'))
            .expect(page.treeNode.withText(pageTitleToCreate).exists).notOk('Discarded node gone from the tree')
            .expect(ReactSelector('Provider').getReact(({props}) => {
                const reduxState = props.store.getState().toJS();
                return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
            })).eql(0, 'No unpublished nodes left')
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('.neos-message-header').withText('Page Not Found').exists).notOk('Make sure we don\'t end up on 404 page')
            .switchToMainWindow();
    });

    await section('Discarding: delete a document node and then discard deletion', async () => {
        const pageTitleToDelete = 'Try me';
        subSection('Navigate via the page tree');
        await t
            .click(page.treeNode.withText(pageTitleToDelete))
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('.neos-nodetypes-headline h1').withText(pageTitleToDelete).exists).ok('Navigated to the page and see the headline inline')
            .switchToMainWindow();
        subSection('Delete that page');
        await t
            .click(ReactSelector('DeleteSelectedNode'))
            .click(Selector('#neos-deleteNodeModal-confirm'))
            .expect(page.treeNode.withText(pageTitleToDelete).exists).notOk('Deleted node gone from the tree')
            .expect(Selector('.neos-message-header').withText('Page Not Found').exists).notOk('Make sure we don\'t end up on 404 page');
        subSection('Discard page deletion');
        await t
            .click(ReactSelector('PublishDropDown ContextDropDownHeader'))
            .click(ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Discard All'))
            .expect(page.treeNode.withText(pageTitleToDelete).exists).ok('Deleted node reappeared in the tree');
    });

    await section('Discarding: create a content node and then discard it', async () => {
        const defaultHeadlineTitle = 'Enter headline here';
        subSection('Create a content node');
        await t
            .click(page.treeNode.withText('Content Collection (main)'))
            .click(ReactSelector('AddNode').nth(1).find('button'))
            .click(ReactSelector('NodeTypeItem').find('button').withText('Headline'))
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('.neos-contentcollection').withText(defaultHeadlineTitle).exists).ok('New headline appeared on the page')
            .switchToMainWindow()
            .expect(page.treeNode.withText(defaultHeadlineTitle).exists).ok('New headline appeared in the tree')
            .expect(ReactSelector('Provider').getReact(({props}) => {
                const reduxState = props.store.getState().toJS();
                return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
            })).gt(0, 'There are some unpublished nodes');

        subSection('Discard that node');
        await t
            .click(ReactSelector('PublishDropDown ContextDropDownHeader'))
            .click(ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Discard All'))
            .expect(page.treeNode.withText(defaultHeadlineTitle).exists).notOk('Discarded node gone from the tree')
            .expect(ReactSelector('Provider').getReact(({props}) => {
                const reduxState = props.store.getState().toJS();
                return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
            })).eql(0, 'No unpublished nodes left')
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('.neos-contentcollection').withText(defaultHeadlineTitle).exists).notOk('New headline gone from the page')
            .switchToMainWindow();
    });

    await section('Discarding: delete a content node and then discard deletion', async () => {
        const headlineToDelete = 'Imagine this...';
        subSection('Delete this headline');
        await t
            .click(page.treeNode.withText(headlineToDelete))
            .click(ReactSelector('DeleteSelectedNode').nth(1))
            .click(Selector('#neos-deleteNodeModal-confirm'))
            .expect(page.treeNode.withText(headlineToDelete).exists).notOk('Deleted node gone from the tree')
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('.neos-inline-editable').withText(headlineToDelete).exists).notOk('New headline gone from the page')
            .switchToMainWindow();
        subSection('Discard page deletion');
        await t
            .click(ReactSelector('PublishDropDown ContextDropDownHeader'))
            .click(ReactSelector('PublishDropDown ShallowDropDownContents').find('button').withText('Discard All'))
            .expect(page.treeNode.withText(headlineToDelete).exists).ok('Deleted node reappeared in the tree')
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('.neos-inline-editable').withText(headlineToDelete).exists).ok('New headline reappeared on the page')
            .switchToMainWindow();
    });

    await section('PageTree search and filter', async () => {
        subSection('Search the page tree');
        const nodeTreeSearchInput = ReactSelector('NodeTreeSearchInput');
        const nodeTreeFilter = ReactSelector('NodeTreeFilter');
        const shortcutFilter = ReactSelector('NodeTreeFilter').find('li').withText('Shortcut');
        await t
            .typeText(nodeTreeSearchInput, 'Download')
            .expect(page.treeNode.withText('Download').count).eql(2, 'Two "Download" nodes should be found, on shortcut and one normal page')
            .expect(page.treeNode.withText('Try me').exists).notOk('Top level "Try me" page should be hidden ');
        subSection('Set the Shortcut filter');
        await t
            .click(nodeTreeFilter)
            .click(shortcutFilter)
            .expect(page.treeNode.withText('Download').count).eql(1, 'Only one "Download" page should be found, of type Shortcut')
            .expect(page.treeNode.withText('Shortcut to child node').exists).notOk('No matching "Shortcut" pages should be hidden')
            .expect(page.treeNode.withText('Try me').exists).notOk('Top level "Try me" page should still be hidden');
        subSection('Clear search');
        const clearSearch = ReactSelector('NodeTreeSearchInput IconButton');
        await t
            .click(clearSearch)
            .expect(page.treeNode.withText('Shortcut to child node').exists).ok('All "Shortcut" pages should be found')
            .expect(page.treeNode.withText('Try me').exists).notOk('Top level "Try me" page should still be hidden');
        subSection('Clear filter');
        const clearFilter = ReactSelector('NodeTreeFilter Button');
        await t
            .click(clearFilter)
            .expect(page.treeNode.withText('Try me').exists).ok('Top level "Try me" page should shown again');
    });

    await section('Can toggle sidebars', async () => {
        subSection('LeftSideBar');
        const leftSideBarToggler = ReactSelector('LeftSideBarToggler Button');
        const leftSideBar = ReactSelector('LeftSideBar');
        await t
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(leftSideBarToggler)
        .expect(leftSideBar.getReact(({props}) => props.isHidden)).eql(false);

        subSection('RightSideBar');
        const rightSideBarToggler = ReactSelector('RightSideBar Button');
        const rightSideBar = ReactSelector('RightSideBar');
        await t
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(true)
        .click(rightSideBarToggler)
        .expect(rightSideBar.getReact(({props}) => props.isHidden)).eql(false);
    });

    await section('Can create a new page', async () => {
        const newPageTitle = 'TestPage';
        const SelectNodeTypeModal = ReactSelector('SelectNodeType');
        await t
            .expect(SelectNodeTypeModal.exists).ok()
            .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(false)
            .click(ReactSelector('AddNode Button'))
            .expect(SelectNodeTypeModal.getReact(({props}) => props.isOpen)).eql(true)
            .click(ReactSelector('NodeTypeItem'))
            .click(Selector('#neos-nodeCreationDialog-back'))
            .click(ReactSelector('NodeTypeItem'))
            .typeText(Selector('#neos-nodeCreationDialog-body input'), newPageTitle)
            .click(Selector('#neos-nodeCreationDialog-createNew'))
            .expect(ReactSelector('NodeCreationDialog').getReact(({props}) => props.isOpen)).eql(false);
        await t
            .switchToIframe('[name="neos-content-main"]')
            .expect(Selector('li').withText(newPageTitle).exists).ok()
            .switchToMainWindow();
    });

    await section('Can create content node from inside InlineUI', async () => {
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
            .expect(Selector('.neos-contentcollection').withText(headlineTitle).exists).ok()
            .switchToMainWindow();
    });
});
