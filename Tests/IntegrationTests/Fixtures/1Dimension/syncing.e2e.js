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
    await prepareContentElementConflictBetweenAdminAndEditor(t);
    await chooseDiscardAllAsResolutionStrategy(t);
    await confirmAndPerformDiscardAll(t);
    await finishSynchronization(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Syncing: Create a conflict state between two editors and choose "Drop conflicting changes" as a resolution strategy during rebase', async t => {
    await prepareContentElementConflictBetweenAdminAndEditor(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await confirmDropConflictingChanges(t);
    await finishSynchronization(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Syncing: Create a conflict state between two editors, start and cancel resolution, then restart and choose "Drop conflicting changes" as a resolution strategy during rebase', async t => {
    await prepareContentElementConflictBetweenAdminAndEditor(t);
    await cancelResolutionDuringStrategyChoice(t);
    await startSynchronization(t);
    await assertThatConflictResolutionHasStarted(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await confirmDropConflictingChanges(t);
    await finishSynchronization(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Syncing: Create a conflict state between two editors and choose "Drop conflicting changes" as a resolution strategy, then cancel and choose "Discard all" as a resolution strategy during rebase', async t => {
    await prepareContentElementConflictBetweenAdminAndEditor(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await cancelDropConflictingChanges(t);
    await chooseDiscardAllAsResolutionStrategy(t);
    await confirmAndPerformDiscardAll(t);
    await finishSynchronization(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Publish + Syncing: Create a conflict state between two editors, then try to publish and choose "Drop conflicting changes" as a resolution strategy during automatic rebase', async t => {
    await prepareDocumentConflictBetweenAdminAndEditor(t);
    await startPublishAll(t);
    await assertThatConflictResolutionHasStarted(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await confirmDropConflictingChanges(t);
    await finishPublish(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'This page will be deleted during sync');
});

test('Publish + Syncing: Create a conflict state between two editors, then try to publish the document only and choose "Drop conflicting changes" as a resolution strategy during automatic rebase', async t => {
    await prepareDocumentConflictBetweenAdminAndEditor(t);
    await startPublishDocument(t);
    await assertThatConflictResolutionHasStarted(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await confirmDropConflictingChanges(t);
    await finishPublish(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'This page will be deleted during sync');
});

async function prepareContentElementConflictBetweenAdminAndEditor(t) {
    await loginAsEditorOnceToInitializeAContentStreamForTheirWorkspaceIfNeeded(t);

    //
    // Login as "admin"
    //
    await as(t, adminUserOnOneDimensionTestSite, async () => {
        await PublishDropDown.discardAll();

        //
        // Create a hierarchy of document nodes
        //
        await createDocumentNode(t, 'Home', 'into', 'Sync Demo #1');
        await createDocumentNode(t, 'Sync Demo #1', 'into', 'Sync Demo #2');
        await createDocumentNode(t, 'Sync Demo #2', 'into', 'Sync Demo #3');

        //
        // Publish everything
        //
        await PublishDropDown.publishAll();
    });

    //
    // Login as "editor"
    //
    await as(t, editorUserOnOneDimensionTestSite, async () => {
        //
        // Sync changes from "admin"
        //
        await t.wait(2000);
        await t.eval(() => location.reload(true));
        await waitForReact(30000);
        await Page.waitForIframeLoading();
        await startSynchronization(t);
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
    });


    //
    // Login as "admin" again
    //
    await as(t, adminUserOnOneDimensionTestSite, async () => {
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
    });


    //
    // Login as "editor" again
    //
    await as(t, editorUserOnOneDimensionTestSite, async () => {
        //
        // Delete page [🗋 Sync Demo #1]
        //
        await deleteDocumentNode(t, 'Sync Demo #1');

        //
        // Publish everything
        //
        await PublishDropDown.publishAll();
    });


    //
    // Login as "admin" again and visit [🗋 Sync Demo #3]
    //
    await as(t, adminUserOnOneDimensionTestSite, async () => {
        await Page.goToPage('Sync Demo #3');

        //
        // Sync changes from "editor"
        //
        await startSynchronization(t);
        await assertThatConflictResolutionHasStarted(t);
    });
}

async function prepareDocumentConflictBetweenAdminAndEditor(t) {
    await loginAsEditorOnceToInitializeAContentStreamForTheirWorkspaceIfNeeded(t);

    await as(t, adminUserOnOneDimensionTestSite, async () => {
        await PublishDropDown.discardAll();
        await createDocumentNode(t, 'Home', 'into', 'This page will be deleted during sync');
        await PublishDropDown.publishAll();

        await t
            .switchToIframe(contentIframeSelector)
            .click(Selector('.neos-contentcollection'))
            .click(Selector('#neos-InlineToolbar-AddNode'))
            .switchToMainWindow()
            .click(Selector('button#into'))
            .click(ReactSelector('NodeTypeItem').withProps({nodeType: {label: 'Headline_Test'}}))
            .switchToIframe(contentIframeSelector)
            .doubleClick(Selector('.test-headline h1'))
            .typeText(Selector('.test-headline h1'), 'This change will not be published.')
            .wait(2000)
            .switchToMainWindow();
    });

    await as(t, editorUserOnOneDimensionTestSite, async () => {
        await t.wait(2000);
        await t.eval(() => location.reload(true));
        await waitForReact(30000);
        await Page.waitForIframeLoading();
        await startSynchronization(t);
        await t.wait(1000);
        await finishSynchronization(t);

        await t.expect(Page.treeNode.withExactText('This page will be deleted during sync').exists)
            .ok('[🗋 This page will be deleted during sync] cannot be found in the document tree of user "editor".');

        await deleteDocumentNode(t, 'This page will be deleted during sync');
        await PublishDropDown.publishAll();
    });

    await switchToRole(t, adminUserOnOneDimensionTestSite);
    await Page.goToPage('This page will be deleted during sync');
}

let editHasLoggedInAtLeastOnce = false;
async function loginAsEditorOnceToInitializeAContentStreamForTheirWorkspaceIfNeeded(t) {
    if (editHasLoggedInAtLeastOnce) {
        return;
    }

    await as(t, editorUserOnOneDimensionTestSite, async () => {
        await Page.waitForIframeLoading();
        await t.wait(2000);
        editHasLoggedInAtLeastOnce = true;
    });
}

async function as(t, role, asyncCallback) {
    await switchToRole(t, role);
    await asyncCallback();
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

async function createDocumentNode(t, referencePageTitle, insertMode, pageTitleToCreate) {
    await Page.goToPage(referencePageTitle);
    await t
        .click(Selector('#neos-PageTree-AddNode'))
        .click(ReactSelector('InsertModeSelector').find('#' + insertMode))
        .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Page_Test'))
        .typeText(Selector('#neos-NodeCreationDialog-Body input'), pageTitleToCreate)
        .click(Selector('#neos-NodeCreationDialog-CreateNew'));
    await Page.waitForIframeLoading();
}

async function deleteDocumentNode(t, pageTitleToDelete) {
    await Page.goToPage(pageTitleToDelete);
    await t.click(Selector('#neos-PageTree-DeleteSelectedNode'));
    await t.click(Selector('#neos-DeleteNodeModal-Confirm'));
    await Page.waitForIframeLoading();
}

async function startPublishAll(t) {
    await t.click(PublishDropDown.publishDropdown)
    await t.click(PublishDropDown.publishDropdownPublishAll);
    await t.click(Selector('#neos-PublishDialog-Confirm'));
}

async function startPublishDocument(t) {
    await t.click(Selector('#neos-PublishDropDown-Publish'))
    await t.click(Selector('#neos-PublishDialog-Confirm'));
}

async function finishPublish(t) {
    await assertThatPublishingHasFinishedWithoutError(t);
    await t.click(Selector('#neos-PublishDialog-Acknowledge'));
    await t.wait(2000);
}

async function startSynchronization(t) {
    await t.click(Selector('#neos-workspace-rebase'));
    await t.click(Selector('#neos-SyncWorkspace-Confirm'));
}

async function cancelResolutionDuringStrategyChoice(t) {
    await t.click(Selector('#neos-SelectResolutionStrategy-Cancel'));
}

async function chooseDiscardAllAsResolutionStrategy(t) {
    await t.click(Selector('#neos-SelectResolutionStrategy-SelectBox'));
    await t.click(Selector('[role="button"]').withText('Discard workspace "user-admin"'));
    await t.click(Selector('#neos-SelectResolutionStrategy-Accept'));
}

async function confirmAndPerformDiscardAll(t) {
    await t.click(Selector('#neos-DiscardDialog-Confirm'));
    await t.expect(Selector('#neos-DiscardDialog-Acknowledge').exists)
        .ok('Acknowledge button for "Discard all" is not available.', {
            timeout: 30000
        });
    // For reasons unknown, we have to press the acknowledge button really
    // hard for testcafe to realize our intent...
    await t.wait(500);
    await t.click(Selector('#neos-DiscardDialog-Acknowledge'));
}

async function chooseDropConflictingChangesAsResolutionStrategy(t) {
    await t.click(Selector('#neos-SelectResolutionStrategy-SelectBox'));
    await t.click(Selector('[role="button"]').withText('Drop conflicting changes'));
    await t.click(Selector('#neos-SelectResolutionStrategy-Accept'));
}

async function confirmDropConflictingChanges(t) {
    await t.click(Selector('#neos-ResolutionStrategyConfirmation-Confirm'));
}

async function cancelDropConflictingChanges(t) {
    await t.click(Selector('#neos-ResolutionStrategyConfirmation-Cancel'));
}

async function finishSynchronization(t) {
    await assertThatSynchronizationHasFinishedWithoutError(t);
    await t.click(Selector('#neos-SyncWorkspace-Acknowledge'));
}

async function assertThatConflictResolutionHasStarted(t) {
    await t.expect(Selector('#neos-SelectResolutionStrategy-SelectBox').exists)
        .ok('Select box for resolution strategy slection is not available', {
            timeout: 30000
        });
}

async function assertThatSynchronizationHasFinishedWithoutError(t) {
    await t.expect(Selector('#neos-SyncWorkspace-Acknowledge').exists)
        .ok('Acknowledge button for "Sync Workspace" is not available.', {
            timeout: 30000
        });
    await t.expect(Selector('#neos-SyncWorkspace-Retry').exists)
        .notOk('An error occurred during "Sync Workspace".', {
            timeout: 30000
        });
}

async function assertThatPublishingHasFinishedWithoutError(t) {
    await t.expect(Selector('#neos-PublishDialog-Acknowledge').exists)
        .ok('Acknowledge button for "Publishing" is not available.', {
            timeout: 30000
        });
    await t.expect(Selector('#neos-PublishDialog-Retry').exists)
        .notOk('An error occurred during "Publishing".', {
            timeout: 30000
        });
}

async function assertThatWeAreOnPage(t, pageTitle) {
    await t
        .expect(Selector('[role="treeitem"] [role="button"][class*="isFocused"]').textContent)
        .eql(pageTitle);
}

async function assertThatWeCannotSeePageInTree(t, pageTitle) {
    await t.expect(Page.treeNode.withExactText(pageTitle).exists)
        .notOk(`[🗋 ${pageTitle}] can still be found in the document tree of user "admin".`);
}
