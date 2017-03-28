import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import makeInitializeGuestFrame from './initializeGuestFrame';

manifest('@neos-project/neos-ui-guestframe', {}, globalRegistry => {
    const guestFrameRegistry = new SynchronousRegistry(`
        # Registry for guest-frame specific functionalities
    `);

    guestFrameRegistry.add('makeInitializeGuestFrame', makeInitializeGuestFrame);
    globalRegistry.add('@neos-project/neos-ui-guestframe', guestFrameRegistry);
});
