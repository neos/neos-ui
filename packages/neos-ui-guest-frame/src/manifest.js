import manifest from '@neos-project/neos-ui-extensibility';

import dom from './dom';
import makeInitializeGuestFrame from './initializeGuestFrame';

manifest('@neos-project/neos-ui-guestframe', globalRegistry => {
    globalRegistry.add('makeInitializeGuestFrame', makeInitializeGuestFrame);
});

export default dom;
