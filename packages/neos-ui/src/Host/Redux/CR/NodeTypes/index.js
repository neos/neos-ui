import Immutable, {Map, List} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

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
// Export the selectors
//
export const selectors = {};
