import uuid from 'uuid';

import {createPlugin} from 'API/index';

import methods from './Methods/index';

const observers = {};

const registerObserver = (...parts) => {
    //
    // Ensure an object structure that follows the given path in depth,
    // ending with an array to push observers to
    //
    parts.reduce((deep, part, index) => {
        if (deep[part] === undefined) {
            if (index === parts.length - 1) {
                deep[part] = [];
            } else {
                deep[part] = {};
            }
        }

        return deep[part];
    }, observers);

    //
    // Expose a small API for a more readable registration of observers
    //
    return {
        react: callback => parts.reduce((deep, part) => deep[part], observers)
            .push(payload => callback(payload))
    };
};

//
// Get all observers for a given address
//
export const getObservers = (...parts) => {
    const observersById = parts
        .reduce((cur, next) => cur.map(cur => cur[next]).filter(cur => cur !== undefined), [observers])[0];

    if (observersById === undefined) {
        return [];
    }

    return Object.keys(observersById).map(id => observersById[id]).reduce((a, b) => a.concat(b), []);
};

//
// Expose portions of the ui state
//
export default store => {
    const {dispatch} = store;

    return createPlugin(
        'ui',
        () => ({
            connect: () => {
                const id = uuid.v4();

                return {
                    //
                    // Observe an exposed portion of the ui state
                    //
                    observe: (...params) => registerObserver(...params, id),

                    //
                    // Remove all observers for this connection
                    //
                    cleanup: () => Object.keys(observers).forEach(key => {
                        observers[key][id] = null;
                    })
                };
            },

            ...methods(dispatch)
        })
    );
};
