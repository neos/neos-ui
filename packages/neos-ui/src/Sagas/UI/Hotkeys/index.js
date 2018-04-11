import Mousetrap from 'mousetrap';
import {take, race} from 'redux-saga/effects';
import {actionTypes} from '@neos-project/neos-ui-redux-store';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * handleHotkeys({globalRegistry, store}) {
    yield take(actionTypes.System.READY);

    const hotkeyRegistry = globalRegistry.get('hotkeys');
    const items = hotkeyRegistry.getAllAsList();
    let mousetrapPaused = false;

    for (let i=0; i<items.length; i++) {
        Mousetrap.bind(items[i].keys, function() {
            store.dispatch(items[i].action());
        });
    }

    while (true) {
        const waitForGuestFrameInteraction = yield race([
            take(actionTypes.UI.ContentCanvas.STOP_LOADING),
            take(actionTypes.UI.ContentCanvas.SET_CURRENTLY_EDITED_PROPERTY_NAME)
        ]);
        const action = Object.values(waitForGuestFrameInteraction)[0];

        // Bind mousetrap to guest frame after content canvas stopped loading
        if (action.type === actionTypes.UI.ContentCanvas.STOP_LOADING) {
            let mousetrapGuest = new Mousetrap(getGuestFrameDocument());
            for (let i=0; i<items.length; i++) {
                mousetrapGuest.bind(items[i].keys, function() {
                    if (mousetrapPaused === false) {
                        store.dispatch(items[i].action());
                    }
                });
            }
        }

        // Pause mousetrap during inline editing
        if (action.type === actionTypes.UI.ContentCanvas.SET_CURRENTLY_EDITED_PROPERTY_NAME) {
            mousetrapPaused = action.payload.propertyName !== '';
        }
    }

}