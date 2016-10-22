import initializeUse from './Use/index';
import initializeFlowQuery from './FlowQuery/index';

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
export default (parent, {csrfToken, alias = 'neos', systemEnv = 'Development'}) => {
    if (csrfToken === undefined) {
        throw new Error('You need to provide a valid csrf token for the Neos API');
    }

    if (parent[alias] !== undefined) {
        throw new Error(`Could not initialize Neos API, because ${alias} is already defined.`);
    }

    const neos = {systemEnv};
    const addLibrary = define(neos);

    addLibrary('use', initializeUse(addLibrary, neos));
    addLibrary('q', initializeFlowQuery(csrfToken));
    addLibrary('csrfToken', () => csrfToken);

    //
    // Attach Neos API to the parent object
    //
    define(parent)(alias, neos);

    return parent[alias];
};

//
// Expose a method to create API plugins
//
export const createPlugin = (identifier, factory) => {
    factory.identifier = identifier;
    return factory;
};
