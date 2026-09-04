import {takeEvery, take, put, select} from 'redux-saga/effects';

import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';

export default function * reloadTreesAfterVisibilityChange({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    yield takeEvery(actionTypes.Changes.PERSIST, function * (action) {
        const affectedContextPaths = action.payload.changes
            .filter(change => change.type === 'Neos.Neos.Ui:Property'
                && change.payload.propertyName === '_hidden')
            .map(change => change.subject);
        if (affectedContextPaths.length === 0) {
            return;
        }

        // Wait until the persist round-trip is fully finished (survives request batching in
        // watchPersist, which re-triggers on FINISH_SAVING while more changes are queued).
        do {
            yield take(actionTypes.UI.Remote.FINISH_SAVING);
        } while (yield select(state => state?.ui?.remote?.isSaving));

        // A hide/show also changes `_hiddenByAncestors` for every descendant. For each affected
        // document node, reload its page-tree subtree so descendant document icons update immediately.
        for (const contextPath of new Set(affectedContextPaths)) {
            const nodeType = yield select(state => state?.cr?.nodes?.byContextPath?.[contextPath]?.nodeType);
            if (nodeType && nodeTypesRegistry.hasRole(nodeType, 'document')) {
                yield put(actions.UI.PageTree.reloadTree(contextPath));
            }
        }

        // Always refresh the current document's content tree: hiding/showing a content node changes
        // its descendants' `_hiddenByAncestors`, and hiding/showing the current document (or one of its
        // document ancestors) makes all of its content inherited-disabled. A single lightweight reload
        // of the current document's content covers both cases.
        yield put(actions.UI.ContentTree.reloadTree());
    });
}
