import uuid from 'uuid';
import {Map} from 'immutable';

let registry = new Map();

//
// Checks, if the given value is a signal description
//
export const isSignalDescription = maybeSignalDescription =>
    maybeSignalDescription && maybeSignalDescription.$__handle !== undefined;

//
// Checks, if the given value is a signal
//
export const isSignal = maybeSignal =>
    maybeSignal && maybeSignal.$__signal !== undefined;

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

const createChainablePropType = validate => {
    const checkType = (isRequired, props, propName, componentName, location) =>{
        componentName = componentName || 'ANONYMOUS';

        if (props[propName] == null) {
            if (isRequired) {
                return new Error(`Required \`${location}\` \`${propName}\` was not specified in \`${componentName}\``);
            }

            return null;
        }

        return validate(props, propName, componentName, location);
    };

    const chainedCheckType = (...args) => checkType(false, ...args);
    checkType.isRequired = (...args) => checkType(true, ...args);

    return checkType;
};

//
// A custom prop type to validate signals
//
export const SignalPropType = createChainablePropType(
    (props, propName, componentName, location) => {
        const prop = props[propName];

        if (!isSignal(prop)) {
            return new Error(`\`${location}\` \`${propName}\` in \`${componentName}\` is not a valid signal`);
        }

        return null;
    }
);
