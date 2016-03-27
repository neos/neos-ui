import Immutable, {Map} from 'immutable';
import {$get} from 'plow-js';

//
// Export the actions
//
export const actions = {
};

//
// Export the initial state hydrator
//
export const hydrate = state => {
    const {nodeTypes} = $get('cr', state);

    return new Map({
        cr: new Map({
            nodeTypes: new Map({
                byName: Immutable.fromJS(nodeTypes.byName),
                constraints: Immutable.fromJS(nodeTypes.constraints),
                inheritanceMap: Immutable.fromJS(nodeTypes.inheritanceMap),
                groups: Immutable.fromJS(nodeTypes.groups)
            })
        })
    });
};

//
// Export the reducer
//
export const reducer = {
};
