import {actions} from '../../Redux/';
import backend from '../Backend.js';
import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

function storePathToChildrenOf(node) {
    return ['ui', 'pageTree'].concat(
          (node.get ? node.get('contextPath') : node).split('@')[0]
              .split('/')
              .reduce((prev, cur) => cur ? prev.concat([cur, 'children']) : prev, [])
              .slice(2)
    );
}

function storePathTo(node) {
    return storePathToChildrenOf(node).slice(0, -1);
}

/**
 * The node tree service
 */
class NodeTreeService {
    constructor(store, csrfToken, endpoints) {
        this.store = store;
        this.csrfToken = csrfToken;

        this.endpoints = {
            loadTree: '/che!/service/load-tree'
        };
    }

    getNode(node) {
        const storePath = storePathTo(node);
        const nodeInStore = $get(this.store.getState(), storePath);

        return nodeInStore;
    }

    loadTree(active, nodeTypeFilter = 'TYPO3.Neos:Document') {
        const {feedbackManager} = backend;
        const activeInStore = this.getNode(active);

        if (activeInStore) {
            const activated = $set(activeInStore, 'isActive', true);
            const focused = $set(activated, 'isFocused', true);

            this.updateNode(focused);
        } else {
            fetch(this.endpoints.loadTree, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Flow-Csrftoken': this.csrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nodeTreeArguments: {
                        active,
                        nodeTypeFilter
                    },
                    includeRoot: true
                })
            })
            .then(response => response.json())
            .then(json => this.store.dispatch(actions.UI.PageTree.setData(json)));
        }
    }

    loadSubTree(root, nodeTypeFilter = 'TYPO3.Neos:Document') {
        const storePath = storePathToChildrenOf(root);
        const rootInStore = this.getNode(root);

        if (!rootInStore.get('children')) {
            const updatedRootInStore = $set(rootInStore, 'isLoading', true);
            this.updateNode(updatedRootInStore);

            fetch(this.endpoints.loadTree, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Flow-Csrftoken': this.csrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nodeTreeArguments: {
                        root,
                        nodeTypeFilter
                    },
                    includeRoot: false
                })
            })
            .then(response => response.json())
            .then(json => {
                const nodeWhichIsNotLoadingAnymore = $set(updatedRootInStore, 'isLoading', false);
                this.updateNode(nodeWhichIsNotLoadingAnymore);
                this.store.dispatch(actions.UI.PageTree.setSubTree(storePath, json));
            });
        }
    }

    updateNode(node) {
        const storePath = storePathTo(node);

        this.store.dispatch(actions.UI.PageTree.setNode(storePath, node));
    }
}

export default (store, csrfToken, endpoint) => new NodeTreeService(store, csrfToken, endpoint);
