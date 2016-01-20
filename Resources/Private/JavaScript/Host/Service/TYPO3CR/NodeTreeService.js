import {actions} from '../../Redux/';
import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

function storePathToChildrenOf(node) {
    return [].concat(
          (node.get ? node.get('contextPath') : node).split('@')[0]
              .split('/')
              .reduce((prev, cur) => cur ? prev.concat([cur, 'children']) : prev, [])
              .slice(2)
    );
}

function storePathTo(node) {
    const path = storePathToChildrenOf(node);

    return path.slice(0, -1);
}

function rootStorePathTo(node) {
    return ['ui', 'pageTree'].concat(storePathTo(node));
}

/**
 * The node tree service
 */
class NodeTreeService {
    constructor(store, csrfToken) {
        this.store = store;
        this.csrfToken = csrfToken;

        this.endpoints = {
            loadTree: '/che!/service/load-tree'
        };
    }

    getNode(node) {
        const storePath = rootStorePathTo(node);
        const nodeInStore = $get(this.store.getState(), storePath);

        return nodeInStore;
    }

    loadTree(active, nodeTypeFilter = 'TYPO3.Neos:Document') {
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
            .then(json => this.store.dispatch(actions.UI.PageTree.setSubTree(storePath, json)));
        }
    }

    updateNode(node) {
        const storePath = storePathTo(node);

        console.log('updateNode', storePath);

        this.store.dispatch(actions.UI.PageTree.setNode(storePath, node));
    }
}

export default (store, csrfToken, endpoint) => new NodeTreeService(store, csrfToken, endpoint);
