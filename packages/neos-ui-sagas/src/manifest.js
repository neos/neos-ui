import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import {
    browser,
    changes,
    crContentDimensions,
    crNodeOperations,
    crPolicies,
    publish,
    serverFeedback,
    uiContentCanvas,
    uiContentTree,
    uiEditPreviewMode,
    uiInspector,
    uiPageTree,
    uiHotkeys
} from './index';

manifest('main.sagas', {}, globalRegistry => {
    //
    // Create edit preview mode registry
    //
    const sagasRegistry = globalRegistry.set('sagas', new SynchronousRegistry(`
        # Saga Registry

        Registry for all sagas.

        NOTE: This is UNPLANNED EXTENSIBILITY, do not modify unless you know what you are doing!
    `));

    sagasRegistry.set('neos-ui/Browser/watchContentURIChange', {saga: browser.watchContentURIChange});

    sagasRegistry.set('neos-ui/Changes/watchPersist', {saga: changes.watchPersist});

    sagasRegistry.set('neos-ui/CR/ContentDimensions/watchSelectPreset', {saga: crContentDimensions.watchSelectPreset});
    sagasRegistry.set('neos-ui/CR/ContentDimensions/watchSetActive', {saga: crContentDimensions.watchSetActive});

    sagasRegistry.set('neos-ui/CR/NodeOperations/addNode', {saga: crNodeOperations.addNode});
    sagasRegistry.set('neos-ui/CR/NodeOperations/pasteNode', {saga: crNodeOperations.pasteNode});
    sagasRegistry.set('neos-ui/CR/NodeOperations/moveDroppedNode', {saga: crNodeOperations.moveDroppedNode});
    sagasRegistry.set('neos-ui/CR/NodeOperations/moveDroppedNodes', {saga: crNodeOperations.moveDroppedNodes});
    sagasRegistry.set('neos-ui/CR/NodeOperations/hideNode', {saga: crNodeOperations.hideNode});
    sagasRegistry.set('neos-ui/CR/NodeOperations/showNode', {saga: crNodeOperations.showNode});
    sagasRegistry.set('neos-ui/CR/NodeOperations/removeNodeIfConfirmed', {saga: crNodeOperations.removeNodeIfConfirmed});
    sagasRegistry.set('neos-ui/CR/NodeOperations/reloadState', {saga: crNodeOperations.reloadState});

    sagasRegistry.set('neos-ui/CR/Policies/watchNodeInformationChanges', {saga: crPolicies.watchNodeInformationChanges});

    sagasRegistry.set('neos-ui/Publish/watchChangeBaseWorkspace', {saga: publish.watchChangeBaseWorkspace});
    sagasRegistry.set('neos-ui/Publish/discardIfConfirmed', {saga: publish.discardIfConfirmed});
    sagasRegistry.set('neos-ui/Publish/watchPublish', {saga: publish.watchPublish});
    sagasRegistry.set('neos-ui/Publish/watchToggleAutoPublish', {saga: publish.watchToggleAutoPublish});

    sagasRegistry.set('neos-ui/ServerFeedback/watchServerFeedback', {saga: serverFeedback.watchServerFeedback});

    sagasRegistry.set('neos-ui/UI/ContentCanvas/watchCanvasUpdateToChangeTitle', {saga: uiContentCanvas.watchCanvasUpdateToChangeTitle});
    sagasRegistry.set('neos-ui/UI/ContentCanvas/watchControlOverIFrame', {saga: uiContentCanvas.watchControlOverIFrame});
    sagasRegistry.set('neos-ui/UI/ContentCanvas/watchNodeCreated', {saga: uiContentCanvas.watchNodeCreated});
    sagasRegistry.set('neos-ui/UI/ContentCanvas/watchStopLoading', {saga: uiContentCanvas.watchStopLoading});
    sagasRegistry.set('neos-ui/UI/ContentCanvas/watchReload', {saga: uiContentCanvas.watchReload});

    sagasRegistry.set('neos-ui/UI/ContentTree/watchNodeFocus', {saga: uiContentTree.watchNodeFocus});
    sagasRegistry.set('neos-ui/UI/ContentTree/watchReloadTree', {saga: uiContentTree.watchReloadTree});

    sagasRegistry.set('neos-ui/UI/EditPreviewMode/watchEditPreviewModesChanged', {saga: uiEditPreviewMode.watchEditPreviewModesChanged});

    sagasRegistry.set('neos-ui/UI/Inspector/inspectorSaga', {saga: uiInspector.inspectorSaga});

    sagasRegistry.set('neos-ui/UI/PageTree/watchCurrentDocument', {saga: uiPageTree.watchCurrentDocument});
    sagasRegistry.set('neos-ui/UI/PageTree/watchNodeCreated', {saga: uiPageTree.watchNodeCreated});
    sagasRegistry.set('neos-ui/UI/PageTree/watchRequestChildrenForContextPath', {saga: uiPageTree.watchRequestChildrenForContextPath});
    sagasRegistry.set('neos-ui/UI/PageTree/watchSearch', {saga: uiPageTree.watchSearch});
    sagasRegistry.set('neos-ui/UI/PageTree/watchToggle', {saga: uiPageTree.watchToggle});

    sagasRegistry.set('neos-ui/UI/Hotkeys/handleHotkeys', {saga: uiHotkeys.handleHotkeys});
});
