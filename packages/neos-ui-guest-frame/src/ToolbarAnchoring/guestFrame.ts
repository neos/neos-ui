// @ts-ignore - the guest frame dom helpers are not typed
import {getGuestFrameDocument, getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

import {ToolbarEnvironment} from './types';

/**
 * The only place where the anchoring reaches into the guest frame.
 * Tests inject a stub into the registry instead.
 */
export const guestFrameEnvironment: ToolbarEnvironment = {
    getWindow: () => getGuestFrameWindow(),
    getDocument: () => getGuestFrameDocument()
};
