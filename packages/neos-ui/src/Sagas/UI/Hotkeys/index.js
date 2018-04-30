import Mousetrap from 'mousetrap';
import {take, race, put} from 'redux-saga/effects';
import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * handleHotkeys({globalRegistry, store}) {
    yield take(actionTypes.System.READY);

    const keyboardShortcuts = globalRegistry.get('frontendConfiguration').get('keyboardShortcuts');
    let mousetrapPaused = false;

    // We get the action as a string from settings
    // and this needs to be converted into a real action
    const getActualAction = actionAsString => actionAsString.split('.').reduce((action, actionStringPart) => {
        if (action && actionStringPart in action) {
            return action[actionStringPart];
        }

        return null;
    }, actions);

    for (const keyboardShortcut of Object.values(keyboardShortcuts)) {
        const actualAction = getActualAction(keyboardShortcut.action.substr(keyboardShortcut.action.indexOf('.') + 1));

        if (actualAction === null) {
            yield put(actions.UI.FlashMessages.add('configuration error', 'You configured a keyboardShortcut which action doesnt exists', 'error'));
            continue;
        }

        Mousetrap.bind(keyboardShortcut.keys, () => {
            store.dispatch(actualAction());
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
            const mousetrapGuest = new Mousetrap(getGuestFrameDocument());

            for (const keyboardShortcut of Object.values(keyboardShortcuts)) {
                mousetrapGuest.bind(keyboardShortcut.keys, () => {
                    if (mousetrapPaused === false) {
                        // strip the preceding 'action.' from string
                        // as we return null if the action is not there we didn't need to check this further
                        const actualAction = getActualAction(keyboardShortcut.action.substr(keyboardShortcut.action.indexOf('.') + 1));

                        if (actualAction === null) {
                            store.dispatch(actions.UI.FlashMessages.add('configuration error', 'You configured a keyboardShortcut which action doesnt exists', 'error'));
                            return;
                        }

                        Mousetrap.bind(keyboardShortcut.keys, () => {
                            store.dispatch(actualAction());
                        });
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
