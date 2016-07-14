import {takeLatest} from 'redux-saga';

import {actionTypes} from 'Guest/Redux/index';
import {call} from 'Guest/Process/SignalRegistry/index';

export function* watchDispatchSignal() {
    yield* takeLatest(actionTypes.EditorToolbar.DISPATCH_SIGNAL, function* dispatchEditorSignal(action) {
        const signal = action.payload;

        // TODO: unclear what signals do and why they are needed -- can we get rid of them?
        call(signal);
    });
}
