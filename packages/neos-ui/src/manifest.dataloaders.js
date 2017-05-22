import {delay} from 'redux-saga';
import {put, select, fork} from 'redux-saga/effects';
import manifest from '@neos-project/neos-ui-extensibility';
import { DataLoadersRegistry } from './Registry/index';
import {selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

manifest('main.dataloaders', {}, globalRegistry => {
    //
    // Create container registry
    //
    globalRegistry.add('dataLoaders', new DataLoadersRegistry(`
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
                - nodeTypes: (TODO!!!)
        `,
        makeCacheSegmentSelector(options) {
            return (state) => {
                const contextForNodeLinking = selectors.UI.NodeLinking.contextForNodeLinking(state);
                const cacheIdentifierParts = contextForNodeLinking.toJS()
                if (options.nodeTypes) {
                    cacheIdentifierParts.nodeTypesFilter = options.nodeTypes;
                } else {
                    cacheIdentifierParts.nodeTypesFilter = ['Neos.Neos:Document'];
                }
                return JSON.stringify(cacheIdentifierParts);
            }
        },
        loadItemsByIds: function* (options, identifiers) {
            if (identifiers && identifiers.length > 0) {
                // Build up query
                const contextForNodeLinking = yield select(selectors.UI.NodeLinking.contextForNodeLinking);
                const searchNodesQuery = contextForNodeLinking.toJS();
                searchNodesQuery.nodeIdentifiers = identifiers;

                // trigger query
                const searchNodesApi = backend.get().endpoints.searchNodes;
                const result = yield searchNodesApi(searchNodesQuery);

                return result;
            }
        },

        search: function* (options, searchTerm) {
            if (searchTerm) {
                // Debounce AJAX requests
                yield delay(300);

                // Build up query
                const contextForNodeLinking = yield select(selectors.UI.NodeLinking.contextForNodeLinking);
                const searchNodesQuery = contextForNodeLinking.toJS();
                searchNodesQuery.searchTerm = searchTerm;

                // trigger query
                const searchNodesApi = backend.get().endpoints.searchNodes;
                const result = yield searchNodesApi(searchNodesQuery);

                return result;
            }

        }
    });
});
