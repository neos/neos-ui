import {takeLatest, takeEvery, put, select} from 'redux-saga/effects';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {showFlashMessage} from '@neos-project/neos-ui-error';

import {isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

export function * watchToggle({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    yield takeLatest(actionTypes.UI.PageTree.TOGGLE, function * toggleTreeNode(action) {
        const state = yield select();
        const {contextPath} = action.payload;

        const children = state?.cr?.nodes?.byContextPath?.[contextPath]?.children;
        const childrenAreFullyLoaded = children
            ?.filter(childEnvelope => nodeTypesRegistry.hasRole(childEnvelope.nodeType, 'document'))
            ?.every(
                childEnvelope => Boolean(state?.cr?.nodes?.byContextPath?.[childEnvelope?.contextPath])
            ) ?? true;

        if (!childrenAreFullyLoaded) {
            yield put(actions.UI.PageTree.requestChildren(contextPath));
        }
    });
}

export function * watchRequestChildrenForContextPath({configuration}) {
    yield takeEvery(actionTypes.UI.PageTree.REQUEST_CHILDREN, function * requestChildrenForContextPath(action) {
        // TODO: Call yield put(actions.UI.PageTree.requestChildren(contextPath));
        const {contextPath, opts} = action.payload;
        const {activate} = opts;
        const {q} = backend.get();
        let parentNodes;
        let childNodes;
        yield put(actions.UI.PageTree.setAsLoading(contextPath));

        try {
            const query = q(contextPath);

            parentNodes = yield query.getForTree();
            const {baseNodeType} = configuration.nodeTree.presets.default;
            childNodes = yield query.neosUiFilteredChildren(baseNodeType).getForTree();
        } catch (err) {
            yield put(actions.UI.PageTree.invalidate(contextPath));
            showFlashMessage({
                id: 'loadChildNodesError',
                severity: 'error',
                message: err.message
            });
        }

        yield put(actions.UI.PageTree.setAsLoaded(contextPath));

        if (childNodes && parentNodes) {
            const nodes = parentNodes.concat(childNodes).reduce((nodeMap, node) => {
                nodeMap[node?.contextPath] = node;
                return nodeMap;
            }, {});

            // The nodes loaded from the server for the tree representation are NOT the full
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

export function * watchNodeCreated() {
    yield takeLatest(actionTypes.UI.Remote.DOCUMENT_NODE_CREATED, function * nodeCreated(action) {
        const {contextPath} = action.payload;

        yield put(actions.UI.PageTree.requestChildren(contextPath, {activate: true}));
    });
}

export function * watchCurrentDocument({configuration}) {
    yield takeLatest(actionTypes.CR.Nodes.SET_DOCUMENT_NODE, function * loadDocumentRootLine(action) {
        const contextPath = action.payload.documentNode;
        const siteNodeContextPath = yield select(selectors.CR.Nodes.siteNodeContextPathSelector);
        const {q} = backend.get();

        let parentContextPath = contextPath;

        const siteNode = yield select(selectors.CR.Nodes.siteNodeSelector);

        // siteNode may be null for a short time when navigating to a page in a different dimension, before the new state is loaded
        if (!siteNode) {
            return;
        }

        const {loadingDepth} = configuration.nodeTree;
        let hasLoadedNodes = false;
        while (parentContextPath !== siteNodeContextPath) {
            const getParentNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(parentContextPath);
            const parentNode = yield select(getParentNodeByContextPathSelector);

            // It's possible we're not allowed to access the parent node due to a NodeTreePrivilege
            if (!parentNode) {
                return;
            }

            // eslint-disable-next-line require-atomic-updates
            parentContextPath = parentNode.parent;
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(parentContextPath);
            let node = yield select(getNodeByContextPathSelector);

            // If the given node is not in the state, load it
            if (!node) {
                yield put(actions.UI.PageTree.setAsLoading(siteNodeContextPath));
                const nodes = yield q(parentContextPath).get();
                yield put(actions.CR.Nodes.merge(nodes.reduce((nodeMap, node) => {
                    nodeMap[node?.contextPath] = node;
                    return nodeMap;
                }, {})));
                node = yield select(getNodeByContextPathSelector);
                hasLoadedNodes = true;
            }

            // Calculate if the given node is collapsed, and if so the uncollapse it
            const isToggled = yield select(
                state => state?.ui?.pageTree?.toggled?.includes(parentContextPath)
            );
            const isCollapsed = isNodeCollapsed(node, isToggled, siteNode, loadingDepth);
            if (isCollapsed) {
                yield put(actions.UI.PageTree.toggle(parentContextPath));
            }
        }

        yield put(actions.UI.PageTree.focus(contextPath));
        if (hasLoadedNodes) {
            yield put(actions.UI.PageTree.setAsLoaded(siteNodeContextPath));
        }
    });
}

export function * watchSearch({configuration}) {
    yield takeLatest(actionTypes.UI.PageTree.COMMENCE_SEARCH, function * searchForNode(action) {
        const siteNodeContextPath = yield select(selectors.CR.Nodes.siteNodeContextPathSelector);
        const result = {
            visibleContextPaths: [siteNodeContextPath],
            toggledContextPaths: [],
            intermediateContextPaths: []
        };
        yield put(actions.UI.PageTree.setSearchResult(result));

        const {contextPath, query: searchQuery, filterNodeType} = action.payload;
        const effectiveFilterNodeType = filterNodeType || configuration.nodeTree.presets.default.baseNodeType;
        const isSearch = Boolean(filterNodeType || searchQuery);

        yield put(actions.UI.PageTree.setAsLoading(contextPath));
        let matchingNodes = [];

        try {
            const {q} = backend.get();
            const query = q(contextPath);

            if (isSearch) {
                matchingNodes = yield query.search(searchQuery, effectiveFilterNodeType).getForTreeWithParents(effectiveFilterNodeType);
            } else {
                const clipboardNodeContextPath = yield select(
                    state => state?.cr?.nodes?.clipboard
                );
                const toggledNodes = yield select(
                    state => state?.ui?.pageTree?.toggled
                );
                const documentNodeContextPath = yield select(
                    state => state?.cr?.nodes?.documentNode
                );

                matchingNodes = yield q([contextPath, documentNodeContextPath]).neosUiDefaultNodes(
                    configuration.nodeTree.presets.default.baseNodeType,
                    configuration.nodeTree.loadingDepth,
                    toggledNodes,
                    clipboardNodeContextPath
                ).getForTree();
            }
        } catch (err) {
            console.error('Error while executing a tree search: ', err);
            yield put(actions.UI.PageTree.invalidate(contextPath));
            showFlashMessage({
                id: 'searchError',
                severity: 'error',
                message: 'There was an error searching in the node tree. Contact your administrator for fixing this issue.'
            });
            return;
        }
        const siteNode = yield select(selectors.CR.Nodes.siteNodeSelector);
        const {loadingDepth} = configuration.nodeTree;

        if (matchingNodes.length > 0) {
            const nodes = matchingNodes.reduce((map, node) => {
                map[node?.contextPath] = node;
                return map;
            }, {});

            yield put(actions.CR.Nodes.merge(nodes));

            const visibleContextPaths = isSearch ? Object.keys(nodes) : null;
            const toggledContextPaths = [];
            const intermediateContextPaths = [];

            Object.keys(nodes).forEach(contextPath => {
                const node = nodes[contextPath];
                if (node.intermediate) {
                    // We reset all toggled state before search, so we can assume "isToggled == false" here
                    const isToggled = false;
                    if (node && siteNode) {
                        const isCollapsed = isNodeCollapsed(node, isToggled, siteNode, loadingDepth);
                        if (isCollapsed) {
                            toggledContextPaths.push(contextPath);
                        }

                        if (!node.matched) {
                            intermediateContextPaths.push(contextPath);
                        }
                    }
                }
            });

            const result = {
                visibleContextPaths,
                toggledContextPaths,
                intermediateContextPaths
            };

            yield put(actions.UI.PageTree.setSearchResult(result));
        }

        yield put(actions.UI.PageTree.setAsLoaded(contextPath));
    });
}
