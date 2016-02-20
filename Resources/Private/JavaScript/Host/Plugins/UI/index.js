import uuid from 'uuid';

import {createPlugin} from 'API/';

import methods from './Methods/';

const observers = {};
const exposers = {};

const registerObserver = (uuid, topic) => {
    if (!observers[topic]) {
        observers[topic] = {};
    }

    if (!observers[topic][uuid]) {
        observers[topic][uuid] = [];
    }

    return {
        react: callback => observers[topic][uuid]
            .push(payload => callback(payload))
    };
};

export const expose = (topic, expose) => {
    let currentState = null;

    exposers[topic] = state => {
        const newState = expose(state);

        if (newState !== currentState && observers[topic]) {
            Object.keys(observers[topic]).map(key => observers[topic][key]).forEach(
                observers => observers.forEach(observer => observer(newState))
            );
        }

        currentState = newState;
    };

    return exposers[topic];
};

//
// Expose portions of the ui state
//
export default store => {
    const {dispatch, subscribe} = store;

    subscribe(() => Object.keys(exposers).forEach(topic => {
        exposers[topic](store.getState());
    }));

    return createPlugin(
        'ui',
        () => ({
            connect: () => {
                const id = uuid.v4();

                return {
                    //
                    // Observe an exposed portion of the ui state
                    //
                    observe: topic => registerObserver(id, topic),

                    //
                    // Remove all observers
                    //
                    cleanup: () => Object.keys(observers).forEach(
                        key => observers[key][id] = null
                    )
                };
            },

            ...methods(dispatch)
        })
    );
};
