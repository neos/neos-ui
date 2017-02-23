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
    const persistentActionsPatterns = [
        '@neos/neos-ui/UI/LeftSideBar/TOGGLE',
        '@neos/neos-ui/UI/RightSidebar/TOGGLE'
    ];

    return next => action => {
        const returnValue = next(action);

        const actionMatched = persistentActionsPatterns
            .some(pattern => action.type === pattern);

        // If UI kind of action, persist state to local storage
        if (actionMatched) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const state = getState();
                // TODO: figure out a more declarative way to manage this. Or just move all persistent state under "ui"
                const persistentStateSubset = {
                    ui: {
                        leftSideBar: {
                            isHidden: $get('ui.leftSideBar.isHidden', state)
                        },
                        rightSideBar: {
                            isHidden: $get('ui.rightSideBar.isHidden', state)
                        }
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
