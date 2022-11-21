import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';
import {beforeEach, subSection, checkPropTypes} from './../../utils.js';
import {
    Page,
    PublishDropDown
} from './../../pageModel';

/* global fixture:true */

fixture`Discarding`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Discarding: create multiple nodes nested within each other and then discard them', async t => {
    const pageTitleToCreate = 'DiscardTest';
    subSection('Create a document node');
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('InsertModeSelector').find('#into'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'));
    await Page.waitForIframeLoading();

    subSection('Create another node inside it');
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('InsertModeSelector').find('#into'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'));
    await Page.waitForIframeLoading();

    subSection('Discard all nodes and hope to be redirected to root');
    await PublishDropDown.discardAll();
    await t
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.nodes.documentNode;
        })).eql('/sites/neos-test-site@user-admin;language=en_US', 'After discarding we are back to the main page');
});

test('Discarding: create a document node and then discard it', async t => {
    const pageTitleToCreate = 'DiscardTest';
    subSection('Create a document node');
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('NodeTypeItem'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'))
        .expect(Page.treeNode.withText(pageTitleToCreate).exists).ok('Node with the given title appeared in the tree')
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
        })).gt(0, 'There are some unpublished nodes');

    subSection('Discard that node');
    await PublishDropDown.discardAll(t);
    await t
        .expect(Page.treeNode.withText(pageTitleToCreate).exists).notOk('Discarded node gone from the tree')
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
        })).eql(0, 'No unpublished nodes left');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.neos-message-header').withText('Page Not Found').exists).notOk('Make sure we don\'t end up on 404 page')
        .switchToMainWindow();
});

test('Discarding: delete a document node and then discard deletion', async t => {
    const pageTitleToDelete = 'Node to delete';
    const headlineOnDeletedPage = 'I\'ll be deleted';

    subSection('Navigate via the page tree');
    await Page.goToPage(pageTitleToDelete);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.test-headline h1').withText(headlineOnDeletedPage).exists).ok('Navigated to the page and see the headline inline')
        .switchToMainWindow();

    subSection('Delete that page');
    await t
        .click(Selector('#neos-PageTree-DeleteSelectedNode'))
        .click(Selector('#neos-DeleteNodeModal-Confirm'))
        .expect(Page.treeNode.withText(pageTitleToDelete).exists).notOk('Deleted node gone from the tree')
        .expect(Selector('.neos-message-header').withText('Page Not Found').exists).notOk('Make sure we don\'t end up on 404 page');

    subSection('Discard page deletion');
    await PublishDropDown.discardAll(t);
    await t
        .expect(Page.treeNode.withText(pageTitleToDelete).exists).ok('Deleted node reappeared in the tree');
});

test('Discarding: create a content node and then discard it', async t => {
    const defaultHeadlineTitle = 'Enter headline here';

    subSection('Create a content node');
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText('Content Collection (main)'))
        .click(Selector('#neos-ContentTree-AddNode'))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Headline'));
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.neos-contentcollection').withText(defaultHeadlineTitle).exists).ok('New headline appeared on the page')
        .switchToMainWindow()
        .expect(Page.treeNode.withText(defaultHeadlineTitle).exists).ok('New headline appeared in the tree')
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
        })).gt(0, 'There are some unpublished nodes');

    subSection('Discard that node');
    await PublishDropDown.discardAll(t);
    await t
        .expect(Page.treeNode.withText(defaultHeadlineTitle).exists).notOk('Discarded node gone from the tree')
        .expect(ReactSelector('Provider').getReact(({props}) => {
            const reduxState = props.store.getState();
            return reduxState.cr.workspaces.personalWorkspace.publishableNodes.length;
        })).eql(0, 'No unpublished nodes left');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.neos-contentcollection').withText(defaultHeadlineTitle).exists).notOk('New headline gone from the page')
        .switchToMainWindow();
});

test('Discarding: delete a content node and then discard deletion', async t => {
    const headlineToDelete = 'Content node to delete';

    subSection('Delete this headline');
    await t
        .click(Selector('#neos-ContentTree-ToggleContentTree'))
        .click(Page.treeNode.withText(headlineToDelete))
        .click(Selector('#neos-ContentTree-DeleteSelectedNode'))
        .click(Selector('#neos-DeleteNodeModal-Confirm'));
    await Page.waitForIframeLoading(t);
    await t
        .expect(Page.treeNode.withText(headlineToDelete).exists).notOk('Deleted node gone from the tree')
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.neos-inline-editable').withText(headlineToDelete).exists).notOk('New headline gone from the page')
        .switchToMainWindow();

    subSection('Discard page deletion');
    await PublishDropDown.discardAll(t);
    await t
        .expect(Page.treeNode.withText(headlineToDelete).exists).ok('Deleted node reappeared in the tree');
    await Page.waitForIframeLoading(t);
    await t
        .switchToIframe('[name="neos-content-main"]')
        .expect(Selector('.neos-inline-editable').withText(headlineToDelete).exists).ok('New headline reappeared on the page')
        .switchToMainWindow();
});
