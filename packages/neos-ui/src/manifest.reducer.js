import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {reducer as coreReducer} from '@neos-project/neos-ui-redux-store';

manifest('main.reducer', {}, globalRegistry => {
    //
    // Create edit preview mode registry
    //
    const reducersRegistry = globalRegistry.set('reducers', new SynchronousRegistry(`
        # Reducers Registry

        NOTE: This is UNPLANNED EXTENSIBILITY, do not modify unless you know what you are doing!
    `));

    reducersRegistry.set('neos-ui/core', {reducer: coreReducer});
});
