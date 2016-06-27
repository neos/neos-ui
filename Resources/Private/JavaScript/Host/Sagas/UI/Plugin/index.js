import {race, take, put, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';
import {CR} from 'Host/Selectors/index';

import {getObservers} from 'Host/Plugins/UI/index';

const getNode = CR.Nodes.byContextPathSelector;
const getFocusedNode = CR.Nodes.focusedSelector;
const getHoveredNode = CR.Nodes.hoveredSelector;

export function* watchNodes() {
    while (true) { // eslint-disable-line no-constant-condition
        const racedActions = yield race([
            take(actionTypes.CR.Nodes.ADD)
        ]);
        const contextPath = Object.keys(racedActions).map(k => racedActions[k]).filter(action => action !== undefined)
            .map(action => action.payload.contextPath)[0];
        const state = yield select();
        const node = getNode(contextPath)(state);
        const observers = getObservers('nodes.byContextPath', contextPath);

        try {
            observers.forEach(observer => observer(node));
        } catch (err) {
            console.error(err);
            yield put(actions.UI.FlashMessages.add('@neos/neos-ui/ui/plugin/observer/watchNodes',
                err.message, 'error', 5000));
        }
    }
}

export function* watchFocusedNode() {
    while (true) { // eslint-disable-line no-constant-condition
        yield race([
            take(actionTypes.CR.Nodes.FOCUS),
            take(actionTypes.CR.Nodes.BLUR)
        ]);

        const state = yield select();
        const node = getFocusedNode(state);
        const typoscriptPath = $get('cr.nodes.focused.typoscriptPath', state);
        const observers = getObservers('nodes.focused');

        try {
            observers.forEach(observer => observer({node, typoscriptPath}));
        } catch (err) {
            console.error(err);
            yield put(actions.UI.FlashMessages.add('@neos/neos-ui/ui/plugin/observer/watchFocusedNode',
                err.message, 'error', 5000));
        }
    }
}

export function* watchHoveredNode() {
    while (true) { // eslint-disable-line no-constant-condition
        yield race([
            take(actionTypes.CR.Nodes.HOVER),
            take(actionTypes.CR.Nodes.UNHOVER)
        ]);

        const state = yield select();
        const node = getHoveredNode(state);
        const typoscriptPath = $get('cr.nodes.hovered.typoscriptPath', state);
        const observers = getObservers('nodes.hovered');

        try {
            observers.forEach(observer => observer({node, typoscriptPath}));
        } catch (err) {
            console.error(err);
            yield put(actions.UI.FlashMessages.add('@neos/neos-ui/ui/plugin/observer/watchHoveredNode',
                err.message, 'error', 5000));
        }
    }
}
