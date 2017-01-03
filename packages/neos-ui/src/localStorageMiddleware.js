import {$get} from 'plow-js';

//
// Local storage middleware.
//
// Saves "ui" part of the state to local storage on every action
// that matches the "persistentActionsPattern"
//
const localStorageMiddleware = ({getState}) => {
    let timer = null;
    const debounceLocalStorageTimeout = 1000;
    const persistentActionsPattern = '@neos/neos-ui/UI';

    return next => action => {
        const returnValue = next(action);

        // If UI kind of action, persist state to local storage
        if (action.type.startsWith(persistentActionsPattern)) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const uiState = $get('ui', getState());
                const persistentStateSubset = {
                    ui: uiState && uiState.toJS()
                };
                localStorage.setItem('persistedState', JSON.stringify(persistentStateSubset));
                timer = null;
            }, debounceLocalStorageTimeout);
        }

        return returnValue;
    };
};

export default localStorageMiddleware;
