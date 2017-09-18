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

        Each Data Loader can have a slightly different API, so check the "description" field of each data loader when using it.

        It is up to the data loaders to implement caching internally.

        Normally, each data loader exposes the following methods:

        resolveValue(options, identifier) {
            // "options" is a DataLoader-specific object.
            // returns Promise with [{identifier, label}, ...] list; where "identifier" was resolved to the actual object represented by "identifier".
        }

        search(options, searchTerm) {
            // "options" is a DataLoader-specific object.
            // returns Promise with [{identifier, label}, ...] list; these are the objects displayed in the selection dropdown.
        }
    `));

    const dataLoadersRegistry = globalRegistry.get('dataLoaders');

    dataLoadersRegistry.add('NodeLookup', {
        description: `
            Look up ContentRepository Nodes:

            - by Node identifier (UUID) (resolveValue())
            - by searching in node properties (search())

            Takes the current context (workspace, dimensions) into account when doing the search, as this is passed in

            OPTIONS:
                - contextForNodeLinking: the current value of "selectors.UI.NodeLinking.contextForNodeLinking", required.
                - nodeTypes: an array of node type names; if set, the search is restricted to these node types.
        `,

        _lru() {
            if (!this._lruCache) {
                this._lruCache = new HLRU(500);
            }
            return this._lruCache;
        },

        resolveValue(options, identifier) {
            return this.resolveValues(options, [identifier]);
        },

        resolveValues(options, identifiers) {
            const resultPromisesByIdentifier = {};
            const identifiersNotInCache = [];

            identifiers.forEach(identifier => {
                const cacheKey = makeCacheKey('resolve', {options, identifier});

                if (this._lru().has(cacheKey)) {
                    resultPromisesByIdentifier[identifier] = this._lru().get(cacheKey);
                } else {
                    identifiersNotInCache.push(identifier);
                }
            });

            let result;
            if (identifiersNotInCache.length > 0) {
                // Build up query
                const searchNodesQuery = Object.assign({}, options.contextForNodeLinking, {
                    nodeIdentifiers: identifiersNotInCache
                });

                // trigger query
                const searchNodesApi = backend.get().endpoints.searchNodes;

                result = searchNodesApi(searchNodesQuery).then(results => {
                    // we store the result in the cache
                    results.forEach(result => {
                        const cacheKey = makeCacheKey('resolve', {options, identifier: result.identifier});
                        const resultPromise = Promise.resolve(result);
                        this._lru().set(cacheKey, resultPromise);
                        resultPromisesByIdentifier[result.identifier] = resultPromise;
                    });

                    // by know,all identifiers are in cache.
                    return Promise.all(
                        identifiers.map(identifier =>
                            resultPromisesByIdentifier[identifier]
                        ).filter(promise => Boolean(promise)) // remove "null" values
                    );
                });
            } else {
                // we know all identifiers are in cache.
                result = Promise.all(
                    identifiers.map(identifier =>
                        resultPromisesByIdentifier[identifier]
                    ).filter(promise => Boolean(promise)) // remove "null" values
                );
            }

            return result;
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
                    searchTerm,
                    nodeTypes: options.nodeTypes
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
                        this._lru().set(cacheKey, Promise.resolve(result));
                    });
                });
                return resultPromise;
            });
        }
    });

    dataLoadersRegistry.add('AssetLookup', {
        description: `
            Look up assets:

            - by identifier (UUID) (resolveValue())
            - by searching (search())
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

            const assetDetailApi = backend.get().endpoints.assetDetail;
            const result = assetDetailApi(identifier);
            const resultPromise = Promise.resolve(result);
            this._lru().set(cacheKey, resultPromise);

            return result;
        },

        resolveValues(options, identifiers) {
            return Promise.all(
                identifiers.map(identifier =>
                    this.resolveValue(options, identifier)
                ).filter(promise => Boolean(promise)) // remove "null" values
            );
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
                // trigger query
                const assetSearchApi = backend.get().endpoints.assetSearch;
                const resultPromise = assetSearchApi(searchTerm);

                this._lru().set(cacheKey, resultPromise);

                // Next to storing the full result in the cache, we also store each individual result in the cache;
                // in the same format as expected by resolveValue(); so that it is already loaded and does not need
                // to be loaded once the element has been selected.
                resultPromise.then(results => {
                    results.forEach(result => {
                        const cacheKey = makeCacheKey('resolve', {options, identifier: result.identifier});
                        this._lru().set(cacheKey, Promise.resolve(result));
                    });
                });
                return resultPromise;
            });
        }
    });

    dataLoadersRegistry.add('DataSources', {
        description: `
            Look up Data Source Values:

            - by identifier (resolveValue())
            - by searching data source values (client-side) (search())

            OPTIONS:
                - contextNodePath: ...
                - dataSourceIdentifier: The data source to load. Either this or dataSourceUri is required.
                - dataSourceUri: The data source URL to load.
                - dataSourceAdditionalData: Additional data to send to the server
        `,

        _lru() {
            if (!this._lruCache) {
                this._lruCache = new HLRU(500);
            }
            return this._lruCache;
        },

        // "identifier" is (currently un-used) 2nd parameter
        resolveValue(options) {
            return this._loadDataSourcesByOptions(options);
        },

        _loadDataSourcesByOptions(options) {
            const cacheKey = makeCacheKey('', options);
            if (this._lru().has(cacheKey)) {
                return this._lru().get(cacheKey);
            }

            const dataSource = backend.get().endpoints.dataSource;
            const params = Object.assign({node: options.contextNodePath}, options.dataSourceAdditionalData || {});
            const resultPromise = dataSource(options.dataSourceIdentifier, options.dataSourceUri, params);

            this._lru().set(cacheKey, resultPromise);
            return resultPromise;
        },

        // "identifiers" is (currently un-used) 2nd parameter
        resolveValues(options) {
            return this._loadDataSourcesByOptions(options);
        }
    });
});
