import uuid from 'uuid';
import {Map} from 'immutable';

let registry = new Map();

//
// Checks, if the given value is a signal description
//
export const isSignalDescription = maybeSignalDescription =>
    maybeSignalDescription && maybeSignalDescription.$__handle !== undefined;

//
// Converts a signal description into a signal
//
export const process = signalDescription => {
    const id = uuid.v4();
    const {$__handle} = signalDescription; // eslint-disable-line camelcase

    registry = registry.set(id, $__handle); // eslint-disable-line camelcase

    return {$__signal: id}; // eslint-disable-line camelcase
};

//
// Execute a signal
//
export const call = signal => {
    const handler = registry.get(signal.$__signal); // eslint-disable-line camelcase

    if (typeof handler === 'function') {
        handler(signal.payload);
    }
};

//
// Create a signal description
//
export const createSignal = handler => ({
    $__handle: handler // eslint-disable-line camelcase
});
