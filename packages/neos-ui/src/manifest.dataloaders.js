import HLRU from 'hashlru';
import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import backend from '@neos-project/neos-ui-backend-connector';

function makeCacheKey(prefix, params) {
    return prefix + JSON.stringify(params);
}

manifest('main.dataloaders', {}, globalRegistry => {
    //
    // Create container registry
    //
    globalRegistry.add('dataLoaders', new SynchronousRegistry(`
        # A "Data Loader" controls asynchronous loading of secondary data, which is used in all kinds of Select / List boxes in the backend.

        Example of data which is loaded through a data loader:
        - Link Labels (in the inline link editor)
        - Reference / References editor
        - Data Sources in the Select Editor

        TODO HIGH LEVEL

        {
            description: "a human readable explanation for the data loader",
            cacheSegment: function* (options) {
                // return string: Cache Segment Identifier to be used!
            }
            loadItemsByIds: function* (options, identifiers) {
                // "options" are the Data-Loader-Specific options
                // "value" is the initial value in the component (e.g. a Node Identifier, or a list of Node Identifiers)

                // NOTE: the data loader can load MORE values than specified in "identifiers", but it should try to load at least the objects referenced in "identifiers".
                //       Thus, if "identifiers" is empty, the data loader might already load stuff.

                return [
                    {
                        ... // arbitarily structured object; needs at least an "identifier" property.
                    }
                ]
            }
        }
    `));

    const dataLoadersRegistry = globalRegistry.get('dataLoaders');

    dataLoadersRegistry.add('NodeLookup', {
        description: `
            Look up ContentRepository Nodes.

            - Identifier: Node Identifier (uuid)
            - Search Term: search in node properties.

            Takes the current context (workspace, dimensions) into account when doing the search.

            OPTIONS:
                - nodeTypes: (TODO!!!, optional)
                - contextForNodeLinking (plain JS object - retrieved from Selector - required)
        `,

        _lru() {
            if (!this._lruCache) {
                this._lruCache = new HLRU(500);
            }
            return this._lruCache;
        },

        resolveValue(options, identifier) {
            const cacheKey = makeCacheKey('resolve', {options, identifier});
            if (this._lru().has(cacheKey)) {
                return this._lru().get(cacheKey);
            }
            const resultPromise = Promise.resolve()
                .then(() => {
                    if (!identifier) {
                        return [];
                    }
                    // Build up query
                    const searchNodesQuery = Object.assign({}, options.contextForNodeLinking, {
                        nodeIdentifiers: [identifier]
                    });

                    // trigger query
                    const searchNodesApi = backend.get().endpoints.searchNodes;
                    return searchNodesApi(searchNodesQuery);
                });

            this._lru().set(cacheKey, resultPromise);
            return resultPromise;
        },

        search(options, searchTerm) {
            if (!searchTerm) {
                return Promise.resolve([]);
            }

            const cacheKey = makeCacheKey('search', {options, searchTerm});
            if (this._lru().has(cacheKey)) {
                return this._lru().get(cacheKey);
            }

            // Debounce AJAX requests for 300 ms
            return new Promise(resolve => {
                if (this._debounceTimer) {
                    window.clearTimeout(this._debounceTimer);
                }
                this._debounceTimer = window.setTimeout(resolve, 300);
            }).then(() => {
                // Build up query
                const searchNodesQuery = Object.assign({}, options.contextForNodeLinking, {
                    searchTerm
                });

                // trigger query
                const searchNodesApi = backend.get().endpoints.searchNodes;
                const resultPromise = searchNodesApi(searchNodesQuery);

                this._lru().set(cacheKey, resultPromise);

                // Next to storing the full result in the cache, we also store each individual result in the cache;
                // in the same format as expected by resolveValue(); so that it is already loaded and does not need
                // to be loaded once the element has been selected.
                resultPromise.then(results => {
                    results.forEach(result => {
                        const cacheKey = makeCacheKey('resolve', {options, identifier: result.identifier});
                        this._lru().set(cacheKey, Promise.resolve([result]));
                    });
                });
                return resultPromise;
            });
        }
    });
});
