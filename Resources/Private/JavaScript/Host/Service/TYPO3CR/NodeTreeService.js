import {actions} from '../../Redux/';
import backend from '../Backend.js';

function nodePathToStorePath(nodePath) {
    return nodePath.split('/').reduce((prev, cur) => {
        if (cur) {
            prev.push(cur);
            prev.push('children');
        }

        return prev;
    }, []).slice(0, -1);
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

    loadTree(root, nodeTypeFilter = 'TYPO3.Neos:Document') {
        const {feedbackManager} = backend;
        const [nodePath] = root.split('@');
        const storePath = nodePathToStorePath(nodePath);

        // this.store.dispatch(actions.UI.PageTree.startLoading(storePath));

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
                includeRoot: true
            })
        })
        .then(response => response.json())
        .then(json => this.store.dispatch(actions.UI.PageTree.setData(json)));
        // .then(() => this.store.dispatch(actions.UI.PageTree.finishLoading(storePath)));
    }

    loadSubTree(root) {

    }
}

export default (store, csrfToken, endpoint) => new NodeTreeService(store, csrfToken, endpoint);
