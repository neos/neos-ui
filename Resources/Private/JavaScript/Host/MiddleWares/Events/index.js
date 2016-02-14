import defer from 'lodash.defer';

//
// Middleware to publish events alongside actions
//
export default (eventMap, neos) => store => next => action => {
    if (!eventMap[action.type]) {
        return next(action);
    }

    const result = next(action);
    const payloadCreators = eventMap[action.type];

    //
    // Defer to ensure, that state mutation takes place before any event
    // is fired
    //
    defer(() => Object.keys(payloadCreators).forEach(eventIdentifier => {
        const payloadCreator = payloadCreators[eventIdentifier];
        neos.broadcast.publish(eventIdentifier, payloadCreator(store.getState(), action));
    }));

    return result;
};

//
// Create a factory for an event subscriber that will have access to the dispatch method
// of the redux store
//
export const createSubscriber = (eventIdentifier, listener) => (neos) => {
    listener.__isAwareOfRedux = true;
    return neos.broadcast.subscribe(eventIdentifier, listener);
};

//
// Create a factory that initializes multiple event subscribers at once
//
export const initializeSubscribers = subscriberFactoryMap => neos =>
    Object.keys(subscriberFactoryMap)
        .map(key => subscriberFactoryMap[key])
        .forEach(subscriberFactory => subscriberFactory(neos));
