import {
    reducer as ImageReducer,
    hydrate as ImageHydrator,
    actionTypes as ImageActionTypes,
    actions as Image
} from './Image/index';

//
// Export the action types
//
export const actionTypes = {
    Image: ImageActionTypes
};

//
// Export the actions
//
export const actions = {
    Image
};

//
// Export the initial state hydrators
//
export const hydrators = [
    ImageHydrator
];

//
// Export the reducer
//
export const reducer = {
    ...ImageReducer
};
