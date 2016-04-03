import {takeLatest} from 'redux-saga';

import {actionTypes} from 'Guest/Redux/index';
import {call} from 'Guest/Containers/EditorToolbar/SignalRegistry/index';

export function* watchDispatchSignal(getState) {
    yield* takeLatest(actionTypes.EditorToolbar.DISPATCH_SIGNAL, function* dispatchEditorSignal(action) {
        const signal = action.payload;

        call(signal);
    });
}
