import Mousetrap from 'mousetrap';
import {takeLatest, take} from 'redux-saga/effects';
import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * handleHotkeys({globalRegistry, store}) {
    yield take(actionTypes.System.READY);

    const hotkeyRegistry = globalRegistry.get('hotkeys');
    const items = hotkeyRegistry.getAllAsList();
    let mousetrapGuest = null;
    let mousetrapPaused = false;

    for (let i=0; i<items.length; i++) {
        Mousetrap.bind(items[i].keys, function() {
            store.dispatch(items[i].action());
        });
    }

    yield [
        takeLatest(
            actionTypes.UI.ContentCanvas.STOP_LOADING, function * () {
                mousetrapGuest = new Mousetrap(getGuestFrameDocument());
                for (let i=0; i<items.length; i++) {
                    mousetrapGuest.bind(items[i].keys, function() {
                        if (mousetrapPaused === false) {
                            store.dispatch(items[i].action());
                        }
                    });
                }}
        ),
        takeLatest(
            actions.UI.ContentCanvas.setCurrentlyEditedPropertyName, function * (action) {
                mousetrapPaused = action.payload.propertyName !== '';
            }
        )
    ];
}