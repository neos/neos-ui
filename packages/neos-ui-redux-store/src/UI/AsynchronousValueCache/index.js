import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const UPDATE_SEARCH_TERM = '@neos/neos-ui/UI/AsynchronousValueCache/UPDATE_SEARCH_TERM';
const SAGA_SET_LOADING_STATE = '@neos/neos-ui/UI/AsynchronousValueCache/SAGA_SET_LOADING_STATE';
const SAGA_SET_LOADING_ERROR = '@neos/neos-ui/UI/AsynchronousValueCache/SAGA_SET_LOADING_ERROR';
const SAGA_SEARCH_RESULTS_LOADED = '@neos/neos-ui/UI/AsynchronousValueCache/SAGA_SEARCH_RESULTS_LOADED';

//
// Export the action types
//
export const actionTypes = {
    UPDATE_SEARCH_TERM,
    SAGA_SET_LOADING_ERROR
};

// TODO: instance identifier is useful to ensure that only one request is in-flight at any given time (for a single editor) while
// the user types. Example of "instance identifier": popertyName
// This action is handled by a SAGA; to maybe trigger a search request
const updateSearchTerm = createAction(UPDATE_SEARCH_TERM, (cacheIdentifier, instanceIdentifier, searchTerm) => ({cacheIdentifier, instanceIdentifier, searchTerm}));

const sagaSetLoadingState = createAction(SAGA_SET_LOADING_STATE, (cacheIdentifier, searchTerm) => ({cacheIdentifier, searchTerm}));
const sagaSetLoadingError = createAction(SAGA_SET_LOADING_ERROR, (cacheIdentifier, searchTerm) => ({cacheIdentifier, searchTerm}));
// "searchResults" is an *array* of objects; each having an "identifier" property which is used as key.
const sagaSearchResultsLoaded = createAction(SAGA_SEARCH_RESULTS_LOADED, (cacheIdentifier, searchTerm, searchResults) => ({cacheIdentifier, searchTerm, searchResults}));

//
// Export the actions
//
export const actions = {
    updateSearchTerm,
    sagaSetLoadingState,
    sagaSetLoadingError,
    sagaSearchResultsLoaded
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.asynchronousValueCache',
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
    [SAGA_SET_LOADING_STATE]: ({cacheIdentifier, searchTerm}) => state => {
        // TODO: check that the object is created recursively!
        return $set(['ui', 'asynchronousValueCache', cacheIdentifier, 'searchStrings', searchTerm], 'LOADING', state);
    },
    [SAGA_SET_LOADING_ERROR]: ({cacheIdentifier, searchTerm}) => state => {
        // TODO: check that the object is created recursively!
        return $set(['ui', 'asynchronousValueCache', cacheIdentifier, 'searchStrings', searchTerm], 'ERROR', state);
    },
    [SAGA_SEARCH_RESULTS_LOADED]: ({cacheIdentifier, searchTerm, searchResults}) => state => {
        searchResults.forEach(result =>
            state = $set(['ui', 'asynchronousValueCache', cacheIdentifier, 'valuesByIdentifier', result.identifier], Immutable.fromJS(result))
        );
        const identifiers = searchResults.map(result => result.identifier);

        return $set(['ui', 'asynchronousValueCache', cacheIdentifier, 'searchStrings', searchTerm], Immutable.fromJS(identifiers), state);
    }
});

//
// Export the selectors
//
export {selectors};
