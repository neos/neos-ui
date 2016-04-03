import uuid from 'uuid';
import {Map} from 'immutable';

let registry = new Map();

export const isSignalDescription = maybeSignalDescription =>
    maybeSignalDescription && maybeSignalDescription.$__handle !== undefined;

export const process = signalDescription => {
    const id = uuid.v4();
    const {$__handle} = signalDescription;

    registry = registry.set(id, $__handle);
    return {$__signal: id};
};

export const call = signal => {
    const handler = registry.get(signal.$__signal);

    if (typeof handler === 'function') {
        handler(signal.payload);
    }
};

export const createSignal = handler => ({
    $__handle: handler
});
