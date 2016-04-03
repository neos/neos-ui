import uuid from 'uuid';
import {Map} from 'immutable';

let registry = new Map();

export const isSignalDescription = maybeSignalDescription =>
    maybeSignalDescription && maybeSignalDescription.$__handle !== undefined;

export const process = signalDescription => {
    const {$__handle} = signalDescription;
    const result = $__handle(registry);

    registry = result.registry;
    return result.id;
};

export const call = (id, payload) => {
    const handler = registry.get(id);

    if (typeof handler === 'function') {
        handler(payload);
    }
};

export const createSignal = handler => ({
    $__handle: registry => {
        const id = uuid.v4();

        if (!registry instanceof Map) {
            throw new Error(`Registry needs to be an instance of Immutable.Map. Found ${typeof registry} instead.`);
        }

        return {
            registry: registry.set(id, handler),
            id
        };
    }
});
