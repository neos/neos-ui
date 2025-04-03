import {Selector} from 'testcafe';
import {ReactSelector, waitForReact} from 'testcafe-react-selectors';
import {
    checkPropTypes,
    adminUserOnOneDimensionTestSite,
    editorUserOnOneDimensionTestSite,
    typeTextInline,
    subSection
} from './../../utils.js';
import {
    Page,
    PublishDropDown
} from './../../pageModel';

/* global fixture:true */

fixture`Syncing`
    .afterEach(() => checkPropTypes());

fixture.skip`TODO After soft removals conflict resolution never imposes a conflict, maybe remove conflict resolution in the Neos ui???`;

test('Syncing: Create a conflict state between two editors and choose "Discard all" as a resolution strategy during rebase', async t => {
    await prepareContentElementConflictBetweenAdminAndEditor(t);
    await chooseDiscardAllAsResolutionStrategy(t);
    await performResolutionStrategy(t);
    await finishDiscard(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Syncing: Create a conflict state between two editors and choose "Drop conflicting changes" as a resolution strategy during rebase', async t => {
    await prepareContentElementConflictBetweenAdminAndEditor(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await performResolutionStrategy(t);
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
    await performResolutionStrategy(t);
    await finishSynchronization(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Syncing: Create a conflict state between two editors and switch between "Drop conflicting changes" and "Discard all" as a resolution strategy during rebase', async t => {
    await prepareContentElementConflictBetweenAdminAndEditor(t);

    // switch back and forth
    await chooseDiscardAllAsResolutionStrategy(t);
    await cancelResolutionStrategy(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await cancelResolutionStrategy(t);
    await chooseDiscardAllAsResolutionStrategy(t);

    await performResolutionStrategy(t);
    await finishDiscard(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #1');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #2');
    await assertThatWeCannotSeePageInTree(t, 'Sync Demo #3');
});

test('Publish + Syncing: Create a conflict state between two editors, then try to publish the site and choose "Drop conflicting changes" as a resolution strategy during automatic rebase', async t => {
    await prepareDocumentConflictBetweenAdminAndEditor(t);
    await startPublishAll(t);
    await assertThatConflictResolutionHasStarted(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await performResolutionStrategy(t);
    await finishPublish(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'This page will be deleted during sync');
});

test('Publish + Syncing: Create a conflict state between two editors, then try to publish the document and choose "Drop conflicting changes" as a resolution strategy during automatic rebase', async t => {
    await prepareDocumentConflictBetweenAdminAndEditor(t);
    await publishDocument(t);
    await assertThatConflictResolutionHasStarted(t);
    await chooseDropConflictingChangesAsResolutionStrategy(t);
    await performResolutionStrategy(t);
    await finishPublish(t);

    await assertThatWeAreOnPage(t, 'Home');
    await assertThatWeCannotSeePageInTree(t, 'This page will be deleted during sync');
});

test('Publish + Syncing: Create a conflict state between two editors, then try to publish the site and choose "Discard all" as a resolution strategy', async t => {
    await prepareDocumentConflictBetweenAdminAndEditor(t);
    await startPublishAll(t);
    await assertThatConflictResolutionHasStarted(t);
    await chooseDiscardAllAsResolutionStrategy(t);
    await performResolutionStrategy(t);
    await finishDiscard(t);

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
        subSection('Create a headline node in the document');
        await Page.goToPage('Sync Demo #3');
        await t
            .switchToMainWindow();

        await openContentTree(t);

        await t
            .wait(1000)
            .click(Page.treeNode.withText('Content Collection (main)'))
            .click(Page.treeNode.withText('Content Collection (main)'))
            .wait(1000)
            .click(Selector('#neos-ContentTree-AddNode'))
            .click(Selector('button#into'))
            .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Headline_Test'))
        await Page.waitForIframeLoading(t);

        subSection('Type something inside of it');
        await typeTextInline(t, '.test-headline:last-child [contenteditable="true"]', 'Hello from Page "Sync Demo #3"!');
        await t
            .expect(Selector('.neos-contentcollection').withText('Hello from Page "Sync Demo #3"!').exists).ok('Typed headline text exists')
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

        subSection('Create a headline node in the document');
        await Page.waitForIframeLoading(t);

        await t
            .switchToMainWindow();

        await openContentTree(t);

        await t
            .wait(1000)
            .click(Page.treeNode.withText('Content Collection (main)'))
            .click(Page.treeNode.withText('Content Collection (main)'))
            .wait(1000)
            .click(Selector('#neos-ContentTree-AddNode'))
            .click(Selector('button#into'))
            .click(ReactSelector('NodeTypeItem').find('button>span>span').withText('Headline_Test'));
        await Page.waitForIframeLoading(t);

        subSection('Type something inside of it');
        await typeTextInline(t, '.test-headline:last-child', 'This change will not be published.');
        await t
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

async function publishDocument(t) {
    await t.click(Selector('#neos-PublishDropDown-Publish'))
}

async function finishPublish(t) {
    await assertThatPublishingHasFinishedWithoutError(t);
    await t.click(Selector('#neos-PublishDialog-Acknowledge'));
    await t.wait(2000);
}

async function finishDiscard(t) {
    await t.click(Selector('#neos-DiscardDialog-Acknowledge'));
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
    await t.click(Selector('[role="button"]').withText('Discard workspace "admin-admington"'));
    await t.click(Selector('#neos-SelectResolutionStrategy-Accept'));
}

async function chooseDropConflictingChangesAsResolutionStrategy(t) {
    await t.click(Selector('#neos-SelectResolutionStrategy-SelectBox'));
    await t.click(Selector('[role="button"]').withText('Drop conflicting changes'));
    await t.click(Selector('#neos-SelectResolutionStrategy-Accept'));
}

async function performResolutionStrategy(t) {
    await t.click(Selector('#neos-ResolutionStrategyConfirmation-Confirm'));
}

async function cancelResolutionStrategy(t) {
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

async function openContentTree(t) {
    const contentTree = ReactSelector('ToggleContentTree');
    const isPanelOpen = await contentTree.getReact(({props}) => props.isPanelOpen);

    if (!isPanelOpen) {
        await t
            .pressKey('t')
            .pressKey('c');
    }
}
