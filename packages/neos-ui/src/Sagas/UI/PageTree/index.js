import {takeLatest, takeEvery} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get, $contains} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

import {parentNodeContextPath, isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

function * watchToggle({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    yield * takeLatest(actionTypes.UI.PageTree.TOGGLE, function * toggleTreeNode(action) {
        const state = yield select();
        const {contextPath} = action.payload;

        const childrenAreFullyLoaded = $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state).toJS()
            .filter(childEnvelope => nodeTypesRegistry.hasRole(childEnvelope.nodeType, 'document'))
            .every(
                childEnvelope => Boolean($get(['cr', 'nodes', 'byContextPath', $get('contextPath', childEnvelope)], state))
            );

        if (!childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
        }
    });
}

function * watchRequestChildrenForContextPath({configuration}) {
    yield * takeEvery(actionTypes.UI.PageTree.REQUEST_CHILDREN, function * requestChildrenForContextPath(action) {
        // ToDo Call yield put(actions.UI.PageTree.requestChildren(contextPath));
        const {contextPath, opts} = action.payload;
        const {activate} = opts;
        const {q} = backend.get();
        let parentNodes;
        let childNodes;
        yield put(actions.UI.PageTree.setAsLoading(contextPath));

        try {
            const query = q(contextPath);

            parentNodes = yield query.getForTree();
            const baseNodeType = configuration.nodeTree.presets.default.baseNodeType;
            childNodes = yield query.neosUiFilteredChildren(baseNodeType).getForTree();
        } catch (err) {
            yield put(actions.UI.PageTree.invalidate(contextPath));
            yield put(actions.UI.FlashMessages.add('loadChildNodesError', err.message, 'error'));
        }

        yield put(actions.UI.PageTree.setAsLoaded(contextPath));

        if (childNodes && parentNodes) {
            const nodes = parentNodes.concat(childNodes).reduce((nodeMap, node) => {
                nodeMap[$get('contextPath', node)] = node;
                return nodeMap;
            }, {});

            // the nodes loaded from the server for the tree representation are NOT the full
            // nodes with all properties; but merely contain as little properties as needed
            // for the tree.
            // In order to not OVERRIDE the properties we already know, we need to merge
            // the data which the nodes already in the system; and not override them completely.
            yield put(actions.CR.Nodes.merge(nodes));

            //
            // ToDo: Set the ContentCanvas src / contextPath
            //
            if (activate) {
                yield put(actions.UI.PageTree.focus(contextPath));
            }
        }
    });
}

function * watchNodeCreated() {
    yield * takeLatest(actionTypes.UI.Remote.DOCUMENT_NODE_CREATED, function * nodeCreated(action) {
        const {contextPath} = action.payload;

        yield put(actions.UI.PageTree.requestChildren(contextPath, {activate: true}));
    });
}

function * watchReloadTree({globalRegistry, configuration}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    yield * takeLatest(actionTypes.UI.PageTree.RELOAD_TREE, function * reloadTree() {
        const documentNodes = yield select(selectors.CR.Nodes.makeGetDocumentNodes(nodeTypesRegistry));
        const {loadingDepth} = configuration.nodeTree;
        const uncollapsedContextPaths = yield select(selectors.UI.PageTree.getUncollapsed, {loadingDepth});
        const nodesToReload = documentNodes.toArray().filter(node =>
            uncollapsedContextPaths.includes(node.get('contextPath')) &&
            node.get('children').filter(child => nodeTypesRegistry.hasRole(child.get('nodeType'), 'document')).size
        );

        for (let i = 0; i < nodesToReload.length; i++) {
            const node = nodesToReload[i];
            const contextPath = node.get('contextPath');

            yield put(actions.UI.PageTree.requestChildren(contextPath, {unCollapse: false}));
        }
    });
}

function * watchCurrentDocument({configuration}) {
    yield * takeLatest(actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH, function * loadDocumentRootLine(action) {
        const {contextPath} = action.payload;
        const siteNodeContextPath = yield select($get('cr.nodes.siteNode'));
        const {q} = backend.get();

        let parentContextPath = contextPath;

        const siteNode = yield select(selectors.CR.Nodes.siteNodeSelector);
        const loadingDepth = configuration.nodeTree.loadingDepth;
        while (parentContextPath !== siteNodeContextPath) {
            parentContextPath = parentNodeContextPath(parentContextPath);
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(parentContextPath);
            let node = yield select(getNodeByContextPathSelector);

            // If the given node is not in the state, load it
            if (!node) {
                yield put(actions.UI.PageTree.setAsLoading(siteNodeContextPath));
                const nodes = yield q(parentContextPath).get();
                yield put(actions.CR.Nodes.add(nodes.reduce((nodeMap, node) => {
                    nodeMap[$get('contextPath', node)] = node;
                    return nodeMap;
                }, {})));
                node = yield select(getNodeByContextPathSelector);
            }

            // Calculate if the given node is collapsed, and if so the uncollapse it
            const isToggled = yield select($contains(parentContextPath, 'ui.pageTree.toggled'));
            const isCollapsed = isNodeCollapsed(node, isToggled, siteNode, loadingDepth);
            if (isCollapsed) {
                yield put(actions.UI.PageTree.toggle(parentContextPath));
            }
        }

        yield put(actions.UI.PageTree.focus(contextPath));
        yield put(actions.UI.PageTree.setAsLoaded(siteNodeContextPath));
    });
}

function * watchSearch({configuration}) {
    yield * takeLatest(actionTypes.UI.PageTree.COMMENCE_SEARCH, function * searchForNode(action) {
        const {contextPath, query: searchQuery, filterNodeType} = action.payload;

        if (!searchQuery && !filterNodeType) {
            return;
        }

        yield put(actions.UI.PageTree.setAsLoading(contextPath));

        const {q} = backend.get();
        const query = q(contextPath);
        const matchingNodes = yield query.search(searchQuery, filterNodeType).getForTreeWithParents();
        const siteNode = yield select(selectors.CR.Nodes.siteNodeSelector);
        const loadingDepth = configuration.nodeTree.loadingDepth;

        if (matchingNodes.length > 0) {
            const nodes = matchingNodes.reduce((map, node) => {
                map[$get('contextPath', node)] = node;
                return map;
            }, {});

            yield put(actions.CR.Nodes.merge(nodes));

            const resultContextPaths = new Set(Object.keys(nodes));
            const oldHidden = yield select($get('ui.pageTree.hidden'));
            const hiddenContextPaths = oldHidden.subtract(resultContextPaths);

            const toggledContextPaths = [];
            const intermediateContextPaths = [];

            Object.keys(nodes).forEach(contextPath => {
                const node = nodes[contextPath];
                if (node.intermediate) {
                    // We reset all toggled state before search, so we can assume "isToggled == false" here
                    const isToggled = false;
                    const isCollapsed = isNodeCollapsed(node, isToggled, siteNode, loadingDepth);
                    if (isCollapsed) {
                        toggledContextPaths.push(contextPath);
                    }

                    if (!node.matched) {
                        intermediateContextPaths.push(contextPath);
                    }
                }
            });

            const result = {
                hiddenContextPaths,
                toggledContextPaths,
                intermediateContextPaths
            };

            yield put(actions.UI.PageTree.setSearchResult(result));
        }

        yield put(actions.UI.PageTree.setAsLoaded(contextPath));
    });
}

export const sagas = [
    watchSearch,
    watchToggle,
    watchRequestChildrenForContextPath,
    watchNodeCreated,
    watchReloadTree,
    watchCurrentDocument
];
