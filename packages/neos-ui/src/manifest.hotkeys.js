import manifest from '@neos-project/neos-ui-extensibility';
import {HotkeyRegistry} from '@neos-project/neos-ui/src/Registry';
import {actions} from '@neos-project/neos-ui-redux-store';

manifest('main.hotkeys', {}, (globalRegistry, {frontendConfiguration}) => {
    //
    // Create hotkeys registry
    //
    const hotkeyRegistry = globalRegistry.set('hotkeys', new HotkeyRegistry(frontendConfiguration.hotkeys, `
        Contains all hot keys.
    `));

    if (frontendConfiguration.hotkeys !== null && frontendConfiguration.hotkeys.length !== 0) {
        hotkeyRegistry.set('UI.RightSideBar.toggle', {
            description: 'Toggle inspector',
            action: actions.UI.RightSideBar.toggle
        });

        hotkeyRegistry.set('UI.FullScreen.toggle', {
            description: 'Toggle full screen',
            action: actions.UI.FullScreen.toggle
        });

        hotkeyRegistry.set('UI.LeftSideBar.toggle', {
            description: 'Toggle left sidebar',
            action: actions.UI.LeftSideBar.toggle
        });

        hotkeyRegistry.set('UI.LeftSideBar.toggleContentTree', {
            description: 'Toggle contenttree',
            action: actions.UI.LeftSideBar.toggleContentTree
        });

        hotkeyRegistry.set('UI.LeftSideBar.toggleSearchBar', {
            description: 'Toggle search bar',
            action: actions.UI.LeftSideBar.toggleSearchBar
        });

        hotkeyRegistry.set('UI.AddNodeModal.close', {
            description: 'Close Add-Node-Modal',
            action: actions.UI.AddNodeModal.close
        });

        hotkeyRegistry.set('UI.Drawer.toggle', {
            description: 'Toggle Drawer',
            action: actions.UI.Drawer.toggle
        });

        hotkeyRegistry.set('UI.InsertionModeModal.cancel', {
            description: 'Cancel InsertionModeModal',
            action: actions.UI.InsertionModeModal.cancel
        });

        hotkeyRegistry.set('UI.InsertionModeModal.apply', {
            description: 'Apply InsertionModeModal',
            action: actions.UI.InsertionModeModal.apply
        });

        hotkeyRegistry.set('UI.ContentCanvas.reload', {
            description: 'Reload ContentCanvas',
            action: actions.UI.ContentCanvas.reload
        });

        hotkeyRegistry.set('UI.Inspector.escape', {
            description: 'Escape Inspector',
            action: actions.UI.Inspector.escape
        });

        hotkeyRegistry.set('UI.Inspector.resume', {
            description: 'Resume Inspector',
            action: actions.UI.Inspector.resume
        });

        hotkeyRegistry.set('UI.NodeCreationDialog.back', {
            description: 'NodeCreationDialog Back',
            action: actions.UI.NodeCreationDialog.back
        });

        hotkeyRegistry.set('UI.NodeCreationDialog.cancel', {
            description: 'NodeCreationDialog Cancel',
            action: actions.UI.NodeCreationDialog.cancel
        });

        hotkeyRegistry.set('UI.NodeCreationDialog.apply', {
            description: 'NodeCreationDialog Apply',
            action: actions.UI.NodeCreationDialog.apply
        });

        hotkeyRegistry.set('UI.NodeVariantCreationDialog.cancel', {
            description: 'NodeVariantCreationDialog Cancel',
            action: actions.UI.NodeVariantCreationDialog.cancel
        });

        hotkeyRegistry.set('UI.NodeVariantCreationDialog.createEmpty', {
            description: 'NodeVariantCreationDialog Create Empty',
            action: actions.UI.NodeVariantCreationDialog.createEmpty
        });

        hotkeyRegistry.set('UI.NodeVariantCreationDialog.createAndCopy', {
            description: 'NodeVariantCreationDialog Create and Copy',
            action: actions.UI.NodeVariantCreationDialog.createAndCopy
        });

        hotkeyRegistry.set('CR.Nodes.unfocus', {
            description: 'Unfocus Node',
            action: actions.CR.Nodes.unFocus
        });
    }
});
