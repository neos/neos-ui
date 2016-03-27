import {Map} from 'immutable';

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
        cr: {
            nodeTypes: new Map({
                byName: new Map(nodeTypes.byName),
                constraints: new Map(nodeTypes.constraints),
                inheritanceMap: new Map(nodeTypes.inheritanceMap),
                groups: new Map(nodeTypes.groups)
            })
        }
    });
};

//
// Export the reducer
//
export const reducer = {
};
