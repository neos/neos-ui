import {takeLatest, put, select} from 'redux-saga/effects';

import backend from '@neos-project/neos-ui-backend-connector';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

export default function * watchReloadState({configuration}) {
    yield takeLatest(actionTypes.CR.Nodes.RELOAD_STATE, function * reloadState(action) {
        const {q} = backend.get();

        const currentSiteNodeContextPath = yield select(
            state => state?.cr?.nodes?.siteNode
        );
        const clipboardNodesContextPaths = yield select(selectors.CR.Nodes.clipboardNodesContextPathsSelector);
        const toggledNodes = yield select(
            state => state?.ui?.pageTree?.toggled
        );
        const siteNodeContextPath = action?.payload?.siteNodeContextPath || currentSiteNodeContextPath;
        const documentNodeContextPath = yield action?.payload?.documentNodeContextPath || select(state => state?.cr?.nodes?.documentNode);
        const {query: searchQuery, filterNodeType} = yield select(state => state?.ui?.pageTree);
        const effectiveFilterNodeType = filterNodeType || configuration.nodeTree.presets.default.baseNodeType;
        const isSearch = Boolean(filterNodeType || searchQuery);
        yield put(actions.CR.Nodes.setDocumentNode(documentNodeContextPath, currentSiteNodeContextPath));
        yield put(actions.UI.PageTree.setAsLoading(currentSiteNodeContextPath));

        let nodes = [];
        if (isSearch) {
            nodes = yield q(siteNodeContextPath).search(searchQuery, effectiveFilterNodeType).getForTreeWithParents(effectiveFilterNodeType);
        } else {
            nodes = yield q([siteNodeContextPath, documentNodeContextPath]).neosUiDefaultNodes(
                configuration.nodeTree.presets.default.baseNodeType,
                configuration.nodeTree.loadingDepth,
                toggledNodes,
                clipboardNodesContextPaths
            ).getForTree();
        }

        const nodeMap = nodes.reduce((nodeMap, node) => {
            nodeMap[node?.contextPath] = node;
            return nodeMap;
        }, {});
        yield put(actions.CR.Nodes.setState({
            siteNodeContextPath,
            documentNodeContextPath,
            nodes: nodeMap,
            merge: action?.payload?.merge
        }));
        yield put(actions.UI.PageTree.setAsLoaded(currentSiteNodeContextPath));
        yield put(actions.CR.Nodes.finishReloadState());
    });
}
