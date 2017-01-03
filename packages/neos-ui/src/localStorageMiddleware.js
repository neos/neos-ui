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
    const persistentActionsPatterns = ['@neos/neos-ui/UI', '@neos/neos-ui/User/Settings'];

    return next => action => {
        const returnValue = next(action);

        const actionMatched = persistentActionsPatterns
            .map(pattern => action.type.startsWith(pattern))
            .reduce((result, current) => result || current, false);
        // If UI kind of action, persist state to local storage
        if (actionMatched) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const state = getState();
                // TODO: figure out a more declarative way to manage this. Or just move all persistent state under "ui"
                const persistentStateSubset = {
                    ui: $get('ui', state) && $get('ui', state).toJS(),
                    user: {
                        settings: $get('user.settings', state)
                    }
                };
                localStorage.setItem('persistedState', JSON.stringify(persistentStateSubset));
                timer = null;
            }, debounceLocalStorageTimeout);
        }

        return returnValue;
    };
};

export default localStorageMiddleware;
