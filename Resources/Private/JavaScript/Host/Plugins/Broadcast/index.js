import {publish, subscribe, unsubscribe} from 'pubsub-js';

import {createPlugin} from 'API/';

//
// A global Pub/Sub system
//
export default dispatch => createPlugin(
    'broadcast',
    () => ({
        //
        // Publish a message to the global event bus
        //
        publish: (topic, payload) => {
            publish(topic, payload);
        },

        //
        // Subscribe to the global event bus
        //
        subscribe: (topic, listener) => {
            if (listener.__isAwareOfRedux === true) {
                return subscribe(topic, (topic, payload) => listener(topic, payload, dispatch, publish));
            }

            return subscribe(topic, listener);
        },

        //
        // Unsubscribe from the global event bus
        //
        unsubscribe
    })
);
