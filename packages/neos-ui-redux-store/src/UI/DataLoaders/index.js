import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const INITIALIZE = '@neos/neos-ui/UI/DataLoaders/INITIALIZE';
const SEARCH = '@neos/neos-ui/UI/DataLoaders/SEARCH';
//const SAGA_SET_LOADING = '@neos/neos-ui/UI/DataLoaders/SAGA_SET_LOADING';
//const SAGA_SET_LOADING_ERROR = '@neos/neos-ui/UI/DataLoaders/SAGA_SET_LOADING_ERROR';
const SAGA_RESULTS_LOADED = '@neos/neos-ui/UI/DataLoaders/SAGA_RESULTS_LOADED';
//const SAGA_SEARCH_RESULTS_LOADED = '@neos/neos-ui/UI/DataLoaders/SAGA_SEARCH_RESULTS_LOADED';

//
// Export the action types
//
export const actionTypes = {
    INITIALIZE,
    SEARCH,
    SAGA_RESULTS_LOADED
};

// This action is triggered when e.g. a Select Editor is rendered for the first time, or its value changes; to ensure
// that the data specified by "currentlySelectedDataIdentifier" is already loaded (or will be loaded).
//
// DO NOT CALL THIS ACTION DIRECTLY, instead call `globalRegistry.get('dataLoaders').getClient(dataLoaderIdentifier, dataLoaderOptions).doInitialize(currentlySelectedDataIdentifier)`.
//
// This action is handled by a "DataLoaderSaga"
//
// "dataLoaderIdentifier" references the key in the "dataLoaders" registry
// "dataLoaderOptions" are the specific options of the data loader.
// "currentlySelectedDataIdentifier" is the identifier of the data-element currently selected (if any); so e.g. the UUID (node identifier) of the currently selected node. Can be either a string or an array of strings, depending on the data loader.
const initialize = createAction(INITIALIZE, (dataLoaderIdentifier, dataLoaderOptions, currentlySelectedDataIdentifier) => ({
    dataLoaderIdentifier,
    dataLoaderOptions,
    currentlySelectedDataIdentifier
}));

// This action is triggered when e.g. the user enters a value in a Select Editor Search Box
//
// DO NOT CALL THIS ACTION DIRECTLY, instead call `globalRegistry.get('dataLoaders').getClient(dataLoaderIdentifier, dataLoaderOptions).doSearch(instanceId, searchTerm)`.
//
// This action is handled by a "DataLoaderSaga"
//
// "dataLoaderIdentifier" references the key in the "dataLoaders" registry
// "dataLoaderOptions" are the specific options of the data loader.
// "instanceId" is an identifier of the caller, which is used to cancel in-flight requests by the same caller.
// "searchTerm" - the text to search for
const search = createAction(SEARCH, (dataLoaderIdentifier, dataLoaderOptions, instanceId, searchTerm) => ({
    dataLoaderIdentifier,
    dataLoaderOptions,
    instanceId,
    searchTerm
}));

// TODO: instance identifier is useful to ensure that only one request is in-flight at any given time (for a single editor) while
// the user types. Example of "instance identifier": popertyName
// This action is handled by a SAGA; to maybe trigger a search request
/*const updateSearchTerm = createAction(UPDATE_SEARCH_TERM, (cacheIdentifier, instanceIdentifier, searchTerm) => ({cacheIdentifier, instanceIdentifier, searchTerm}));

const sagaSetLoadingState = createAction(SAGA_SET_LOADING_STATE, (cacheIdentifier, searchTerm) => ({cacheIdentifier, searchTerm}));
const sagaSetLoadingError = createAction(SAGA_SET_LOADING_ERROR, (cacheIdentifier, searchTerm) => ({cacheIdentifier, searchTerm}));
*/

// "results" is an *array* of objects; each having an "identifier" property which is used as key.
const sagaResultsLoaded = createAction(SAGA_RESULTS_LOADED, (cacheSegment, results, searchTerm = false) => ({cacheSegment, results, searchTerm}));

//
// Export the actions
//
export const actions = {
    initialize,
    search,
    sagaResultsLoaded
    /*updateSearchTerm,
    sagaSetLoadingState,
    sagaSetLoadingError,
    sagaSearchResultsLoaded*/
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.dataLoaders',
        new Map()
        /**
           Each map ELEMENT is of the following structure:
           "valuesByIdentifier": {
                "dd118fff-5d1c-4fec-82a9-aef33df21447": { "label": "Homepage" },
                "82dc8a1d-6097-40d2-bf79-1fedbd6d9aed": { "label": "Homer Simpson" },
                "9f52e19c-677e-4a70-be73-daa7d99c8c56": { "label": "Neos CMS" },
                "ed7c2575-4a7a-4dfb-bec6-2f19abb53997": "LOADING" // "LOADING" is a special key meaning we are currently loading the values.
            },
            "searchStrings": {
                "": ["dd118fff-5d1c-4fec-82a9-aef33df21447", "82dc8a1d-6097-40d2-bf79-1fedbd6d9aed", "9f52e19c-677e-4a70-be73-daa7d99c8c56"],
                "H": ["82dc8a1d-6097-40d2-bf79-1fedbd6d9aed", "dd118fff-5d1c-4fec-82a9-aef33df21447"],
                "Home": ["82dc8a1d-6097-40d2-bf79-1fedbd6d9aed", "dd118fff-5d1c-4fec-82a9-aef33df21447"],
                "Homep": ["dd118fff-5d1c-4fec-82a9-aef33df21447"],
                "Ne": ["9f52e19c-677e-4a70-be73-daa7d99c8c56"],
                "Neo": "LOADING" // "LOADING" is a special key meaning we are currently loading the values.
            }
         */
    ),
    [SAGA_RESULTS_LOADED]: ({cacheSegment, results, searchTerm}) => state => {
        results.forEach(result =>
            state = $set(['ui', 'dataLoaders', cacheSegment, 'valuesByIdentifier', result.identifier], Immutable.fromJS(result), state)
        );

        if (searchTerm !== false) {
            const identifiers = results.map(result => result.identifier);

            return $set(['ui', 'dataLoaders', cacheSegment, 'searchStrings', searchTerm], Immutable.fromJS(identifiers), state);
        }
        return state;
    }


    /*[SAGA_SET_LOADING_STATE]: ({cacheIdentifier, searchTerm}) => state => {
        // TODO: check that the object is created recursively!
        return $set(['ui', 'asynchronousValueCache', cacheIdentifier, 'searchStrings', searchTerm], 'LOADING', state);
    },
    [SAGA_SET_LOADING_ERROR]: ({cacheIdentifier, searchTerm}) => state => {
        // TODO: check that the object is created recursively!
        return $set(['ui', 'asynchronousValueCache', cacheIdentifier, 'searchStrings', searchTerm], 'ERROR', state);
    },*/
});

//
// Export the selectors
//
export {selectors};
