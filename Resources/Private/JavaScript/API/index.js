import initializeUse from './Use/';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

const define = parent => (name, value) => {
    if (typeof parent[name] !== 'undefined') {
        throw new Error(`Could not add library ${name}, because it is already defined.`);
    }

    return Object.defineProperty(parent, name, createReadOnlyValue(value));
};

//
// Initializes the Neos API
//
export default (parent, csrfToken, alias = 'neos') => {
    if (typeof csrfToken === 'undefined') {
        throw new Error(`You need to provide a valid csrf token for the Neos API`);
    }

    if (typeof parent[alias] !== 'undefined') {
        throw new Error(`Could not initialize Neos API, because ${alias} is already defined.`);
    }

    const neos = {};
    const addLibrary = define(neos);

    addLibrary('use', initializeUse(addLibrary, neos));
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
