import uuid from 'uuid';

import {createPlugin} from 'API/';

import methods from './Methods/';

const observers = {};
const exposers = {};

const registerObserver = (uuid, topic, params = []) => {
    if (!observers[topic]) {
        observers[topic] = {};
    }

    if (!observers[topic][uuid]) {
        observers[topic][uuid] = [];
    }

    return {
        react: callback => observers[topic][uuid]
            .push({
                state: null,
                action: payload => callback(payload),
                params
            })
    };
};

export const expose = (topic, expose) => {
    exposers[topic] = reduxState => {
        if (observers[topic]) {
            Object.keys(observers[topic]).map(key => observers[topic][key]).forEach(
                observers => observers.forEach(observer => {
                    const state = expose(reduxState, ...observer.params);

                    if (observer.state !== state) {
                        observer.action(state, ...observer.params);
                        observer.state = state;
                    }
                })
            );
        }
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
                    observe: (topic, ...params) => registerObserver(id, topic, params),

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
