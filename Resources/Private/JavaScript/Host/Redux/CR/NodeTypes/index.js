import Immutable, {Map} from 'immutable';
import {$set, $get} from 'plow-js';

//
// Export the actions
//
export const actions = {
};

//
// Export the initial state hydrator
//
export const hydrate = state => $set(
    'cr.nodeTypes',
    new Map({
        byName: Immutable.fromJS($get('cr.nodeTypes.byName', state)),
        constraints: Immutable.fromJS($get('cr.nodeTypes.constraints', state)),
        inheritanceMap: Immutable.fromJS($get('cr.nodeTypes.inheritanceMap', state)),
        groups: Immutable.fromJS($get('cr.nodeTypes.groups', state))
    })
);

//
// Export the reducer
//
export const reducer = {
};
