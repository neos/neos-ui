import initializeUse from './Use/index';
import initializeFlowQuery from './FlowQuery/index';
import initializeEndpoints from './Endpoints/index';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export const define = parent => (name, value) => {
    if (parent[name] !== undefined) {
        throw new Error(`Could not add library ${name}, because it is already defined.`);
    }

    return Object.defineProperty(parent, name, createReadOnlyValue(value));
};

//
// Initializes the Neos API
//
export const initializeJsAPI = (parent, {alias = 'neos', systemEnv = 'Development', routes}) => {
    if (parent[alias] !== undefined) {
        throw new Error(`Could not initialize Neos API, because ${alias} is already defined.`);
    }

    const neos = {systemEnv};
    const addLibrary = define(neos);

    addLibrary('use', initializeUse(addLibrary, neos));
    addLibrary('q', initializeFlowQuery(routes));
    addLibrary('endpoints', initializeEndpoints(routes));

    //
    // Attach Neos API to the parent object
    //
    define(parent)(alias, neos);

    return parent[alias];
};

//
// Expose methods to access the initialized api
//
export default {
    get(alias = 'neos', ctx = window) {
        return ctx[alias];
    }
};

//
// Expose a method to create API plugins
//
export const createPlugin = (identifier, factory) => {
    factory.identifier = identifier;
    return factory;
};
