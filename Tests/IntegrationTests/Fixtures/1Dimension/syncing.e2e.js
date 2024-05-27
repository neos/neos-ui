import {Selector} from 'testcafe';
import {ReactSelector, waitForReact} from 'testcafe-react-selectors';
import {checkPropTypes, adminUserOnOneDimensionTestSite, editorUserOnOneDimensionTestSite} from './../../utils.js';
import {
    Page,
    PublishDropDown
} from './../../pageModel';

/* global fixture:true */

fixture`Syncing`
    .afterEach(() => checkPropTypes());

const contentIframeSelector = Selector('[name="neos-content-main"]', {timeout: 2000});

test('Syncing: Create a conflict state between two editors and choose "Discard all" as a resolution strategy during rebase', async t => {
    await prepareConflictBetweenAdminAndEditor(t);
    await chooseDiscardAllAndFinishSynchronization(t);
    await assertThatSynchronizationWasSuccessful(t);
});

test('Syncing: Create a conflict state between two editors and choose "Drop conflicting changes" as a resolution strategy during rebase', async t => {
    await prepareConflictBetweenAdminAndEditor(t);
    await chooseDropConflictingChangesAndFinishSynchronization(t);
    await assertThatSynchronizationWasSuccessful(t);
});

async function prepareConflictBetweenAdminAndEditor(t) {
    //
    // Login as "editor" once, to initialize a content stream for their workspace
    // in case there isn't one already
    //
    await switchToRole(t, editorUserOnOneDimensionTestSite);
    await Page.waitForIframeLoading();
    await t.wait(2000);

    //
    // Login as "admin"
    //
    await switchToRole(t, adminUserOnOneDimensionTestSite);
    await PublishDropDown.discardAll();

    //
    // Create a hierarchy of document nodes
    //
    async function createDocumentNode(pageTitleToCreate) {
        await t
            .click(Selector('#neos-PageTree-AddNode'))
            .click(ReactSelector('InsertModeSelector').find('#into'))
            .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Page_Test'))
            .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
            .click(Selector('#neos-NodeCreationDialog-CreateNew'));
        await Page.waitForIframeLoading();
    }
    await createDocumentNode('Sync Demo #1');
    await createDocumentNode('Sync Demo #2');
    await createDocumentNode('Sync Demo #3');

    //
    // Publish everything
    //
    await PublishDropDown.publishAll();

    //
    // Login as "editor"
    //
    await switchToRole(t, editorUserOnOneDimensionTestSite);

    //
    // Sync changes from "admin"
    //
    await t.wait(2000);
    await t.eval(() => location.reload(true));
    await waitForReact(30000);
    await Page.waitForIframeLoading();
    await t.click(Selector('#neos-workspace-rebase'));
    await t.click(Selector('#neos-SyncWorkspace-Confirm'));
    await t.wait(1000);

    //
    // Assert that all 3 documents are now visible in the document tree
    //
    await t.expect(Page.treeNode.withExactText('Sync Demo #1').exists)
        .ok('[🗋 Sync Demo #1] cannot be found in the document tree of user "editor".');
    await t.expect(Page.treeNode.withExactText('Sync Demo #2').exists)
        .ok('[🗋 Sync Demo #2] cannot be found in the document tree of user "editor".');
    await t.expect(Page.treeNode.withExactText('Sync Demo #3').exists)
        .ok('[🗋 Sync Demo #3] cannot be found in the document tree of user "editor".');

    //
    // Login as "admin" again
    //
    await switchToRole(t, adminUserOnOneDimensionTestSite);

    //
    // Create a headline node in [🗋 Sync Demo #3]
    //
    await Page.goToPage('Sync Demo #3');
    await t
        .switchToIframe(contentIframeSelector)
        .click(Selector('.neos-contentcollection'))
        .click(Selector('#neos-InlineToolbar-AddNode'))
        .switchToMainWindow()
        .click(Selector('button#into'))
        .click(ReactSelector('NodeTypeItem').withProps({nodeType: {label: 'Headline_Test'}}))
        .switchToIframe(contentIframeSelector)
        .typeText(Selector('.test-headline h1'), 'Hello from Page "Sync Demo #3"!')
        .wait(2000)
        .switchToMainWindow();

    //
    // Login as "editor" again
    //
    await switchToRole(t, editorUserOnOneDimensionTestSite);

    //
    // Delete page [🗋 Sync Demo #1]
    //
    await Page.goToPage('Sync Demo #1');
    await t.click(Selector('#neos-PageTree-DeleteSelectedNode'));
    await t.click(Selector('#neos-DeleteNodeModal-Confirm'));
    await Page.waitForIframeLoading();

    //
    // Publish everything
    //
    await PublishDropDown.publishAll();

    //
    // Login as "admin" again and visit [🗋 Sync Demo #3]
    //
    await switchToRole(t, adminUserOnOneDimensionTestSite);
    await Page.goToPage('Sync Demo #3');

    //
    // Sync changes from "editor"
    //
    await t.click(Selector('#neos-workspace-rebase'));
    await t.click(Selector('#neos-SyncWorkspace-Confirm'));
    await t.expect(Selector('#neos-SelectResolutionStrategy-SelectBox').exists)
        .ok('Select box for resolution strategy slection is not available', {
            timeout: 30000
        });
}

async function switchToRole(t, role) {
    // We need to add a time buffer here, otherwise `t.useRole` might interrupt
    // some long-running background process, errororing like this:
    //  > Error: NetworkError when attempting to fetch resource.
    await t.wait(2000);
    await t.useRole(role);
    await waitForReact(30000);
    await Page.goToPage('Home');
}

async function chooseDiscardAllAndFinishSynchronization(t) {
    //
    // Choose "Discard All" as resolution strategy
    //
    await t.click(Selector('#neos-SelectResolutionStrategy-SelectBox'));
    await t.click(Selector('[role="button"]').withText('Discard workspace "user-admin"'));
    await t.click(Selector('#neos-SelectResolutionStrategy-Accept'));

    //
    // Go through discard workflow
    //
    await t.click(Selector('#neos-DiscardDialog-Confirm'));
    await t.expect(Selector('#neos-DiscardDialog-Acknowledge').exists)
        .ok('Acknowledge button for "Discard all" is not available.', {
            timeout: 30000
        });
    // For reasons unknown, we have to press the acknowledge button really
    // hard for testcafe to realize our intent...
    await t.wait(500);
    await t.click(Selector('#neos-DiscardDialog-Acknowledge'));

    //
    // Synchronization should restart automatically,
    // so we must wait for it to succeed
    //
    await t.expect(Selector('#neos-SyncWorkspace-Acknowledge').exists)
        .ok('Acknowledge button for "Sync Workspace" is not available.', {
            timeout: 30000
        });
    await t.click(Selector('#neos-SyncWorkspace-Acknowledge'));
}

async function chooseDropConflictingChangesAndFinishSynchronization(t) {
    //
    // Choose "Drop conflicting changes" as resolution strategy
    //
    await t.click(Selector('#neos-SelectResolutionStrategy-SelectBox'));
    await t.click(Selector('[role="button"]').withText('Drop conflicting changes'));
    await t.click(Selector('#neos-SelectResolutionStrategy-Accept'));

    //
    // Confirm the strategy
    //
    await t.click(Selector('#neos-ResolutionStrategyConfirmation-Confirm'));
    await t.expect(Selector('#neos-SyncWorkspace-Acknowledge').exists)
        .ok('Acknowledge button for "Sync Workspace" is not available.', {
            timeout: 30000
        });
    await t.click(Selector('#neos-SyncWorkspace-Acknowledge'));
}

async function assertThatSynchronizationWasSuccessful(t) {
    //
    // Assert that we have been redirected to the home page by checking if
    // the currently focused document tree node is "Home".
    //
    await t
        .expect(Selector('[role="treeitem"] [role="button"][class*="isFocused"]').textContent)
        .eql('Home');

    //
    // Assert that all 3 documents are not visible anymore in the document tree
    //
    await t.expect(Page.treeNode.withExactText('Sync Demo #1').exists)
        .notOk('[🗋 Sync Demo #1] can still be found in the document tree of user "admin".');
    await t.expect(Page.treeNode.withExactText('Sync Demo #2').exists)
        .notOk('[🗋 Sync Demo #2] can still be found in the document tree of user "admin".');
    await t.expect(Page.treeNode.withExactText('Sync Demo #3').exists)
        .notOk('[🗋 Sync Demo #3] can still be found in the document tree of user "admin".');
}
