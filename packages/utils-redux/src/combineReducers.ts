import {$set, $get} from 'plow-js';

// TODO: this is a temporarily implementation that will be replace by the original
// solution from redux, when all reducers have been converted
const combineReducers = (reducersMap: any) => (state: any, action: any) => {
    return Object.keys(reducersMap).reduce(
        (currentState, reducerKey: any) => {
            // We pass undefined so the defaultState would be used if no state is defined
            const subState = $get(reducerKey, state) || undefined;
            const newSubstate = reducersMap[reducerKey](
                subState,
                action
            );
            return $set(
                reducerKey,
                newSubstate,
                currentState
            );
        },
        // In case of empty state, init it with {}
        state || {}
    );
};

export default combineReducers;
