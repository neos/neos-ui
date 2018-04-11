import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {actions} from '@neos-project/neos-ui-redux-store';

manifest('main.hotkeys', {}, globalRegistry => {
    //
    // Create hotkeys registry
    //
    const hotkeyRegistry = globalRegistry.set('hotkeys', new SynchronousRegistry(`
        Contains all hot keys.
    `));

    hotkeyRegistry.set('UI.RightSideBar.toggle', {
        keys: 'g i',
        description: 'Toggle right sidebar',
        action: actions.UI.RightSideBar.toggle
    });
});
