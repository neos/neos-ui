import Immutable, {Map, List} from 'immutable';
import {createSelector, defaultMemoize} from 'reselect';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

//
// Export the actions
//
export const actions = {
};

//
// Helper function to exchange immutable types at certain paths
//
const fixProperties = (...conversions) => subject => conversions.reduce(
    (subject, [path, WrongType, CorrectedType]) => $set(
        path,
        $get(path, subject) instanceof WrongType ?
            new CorrectedType() : $get(path, subject)
        ,
        subject
    ),
    subject
);

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.nodeTypes',
        new Map({
            byName: Immutable.fromJS($get('cr.nodeTypes.byName', state)).map(
                //
                // Workaround to fix the result of json_encode's ambiguous
                // array conversion
                // TODO: find a better solution for this
                //
                fixProperties(
                    ['properties.title.ui.aloha.format', List, Map],
                    ['properties.title.ui.aloha.link', List, Map]
                )
            ),
            constraints: Immutable.fromJS($get('cr.nodeTypes.constraints', state)),
            inheritanceMap: Immutable.fromJS($get('cr.nodeTypes.inheritanceMap', state)),
            groups: Immutable.fromJS($get('cr.nodeTypes.groups', state))
        })
    )
});

//
// selectors
//

const byNameSelector = state => name => $get(['cr', 'nodeTypes', 'byName', name], state);

const subTypesSelector = name => $get(['cr', 'nodeTypes', 'inheritanceMap', 'subTypes', name]);

const isOfTypeSelector = defaultMemoize(
    superTypeName => subTypeName => createSelector(
        [
            subTypesSelector(superTypeName)
        ],
        subTypes => subTypes.indexOf(subTypeName) !== -1
    )
);

//
// Export the selectors
//
export const selectors = {
    byNameSelector,
    subTypesSelector,
    isOfTypeSelector
};
