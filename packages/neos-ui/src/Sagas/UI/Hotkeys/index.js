import Mousetrap from 'mousetrap';
import {take, race} from 'redux-saga/effects';
import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * handleHotkeys({globalRegistry, store}) {
    yield take(actionTypes.System.READY);

    const keyboardShortcuts = globalRegistry.get('frontendConfiguration').get('keyboardShortcuts');
    let mousetrapPaused = false;

    const getActualAction = actionAsString => {
        const actionStringParts = actionAsString.split('.');

        const actualAction = actionStringParts.reduce((acc, curr) => {
            if (acc[curr]) {
                return acc[curr];
            }

            return null;
        }, actions);

        return actualAction;
    };

    for (const keyboardShortcut in keyboardShortcuts) {
        if (Object.prototype.hasOwnProperty.call(keyboardShortcuts, keyboardShortcut)) {
            const shortcut = keyboardShortcuts[keyboardShortcut];
            const actualAction = getActualAction(shortcut.action.substr(shortcut.action.indexOf('.') + 1));

            Mousetrap.bind(shortcut.keys, () => {
                store.dispatch(actualAction());
            });
        }
    }

    while (true) {
        const waitForGuestFrameInteraction = yield race([
            take(actionTypes.UI.ContentCanvas.STOP_LOADING),
            take(actionTypes.UI.ContentCanvas.SET_CURRENTLY_EDITED_PROPERTY_NAME)
        ]);
        const action = Object.values(waitForGuestFrameInteraction)[0];

        // Bind mousetrap to guest frame after content canvas stopped loading
        if (action.type === actionTypes.UI.ContentCanvas.STOP_LOADING) {
            const mousetrapGuest = new Mousetrap(getGuestFrameDocument());

            for (const keyboardShortcut in keyboardShortcuts) {
                if (Object.prototype.hasOwnProperty.call(keyboardShortcuts, keyboardShortcut)) {
                    const shortcut = keyboardShortcuts[keyboardShortcut];
                    mousetrapGuest.bind(shortcut.keys, () => {
                        if (mousetrapPaused === false) {
                            const actualAction = getActualAction(shortcut.action.substr(shortcut.action.indexOf('.') + 1));

                            Mousetrap.bind(shortcut.keys, () => {
                                store.dispatch(actualAction());
                            });
                        }
                    });
                }
            }
        }

        // Pause mousetrap during inline editing
        if (action.type === actionTypes.UI.ContentCanvas.SET_CURRENTLY_EDITED_PROPERTY_NAME) {
            mousetrapPaused = action.payload.propertyName !== '';
        }
    }
}
