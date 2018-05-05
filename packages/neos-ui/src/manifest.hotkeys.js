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

    hotkeyRegistry.set('UI.RightSideBar.toggle', {
        description: 'Toggle inspector',
        action: actions.UI.RightSideBar.toggle
    });

    hotkeyRegistry.set('UI.FullScreen.toggle', {
        description: 'Toggle full screen',
        action: actions.UI.FullScreen.toggle
    });
});
