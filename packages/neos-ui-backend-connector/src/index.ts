import initializeUse from './Use/index';
import initializeFlowQuery from './FlowQuery/index';
import initializeEndpoints, {Routes} from './Endpoints/index';
import fetchWithErrorHandling from './FetchWithErrorHandling/index';

const createReadOnlyValue = <T>(value: T) => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export const define = (parent: {[propName: string]: any}) => (name: string, value: any) => {
    if (parent[name] !== undefined) {
        throw new Error(`Could not add library ${name}, because it is already defined.`);
    }

    return Object.defineProperty(parent, name, createReadOnlyValue(value));
};

//
// Initializes the Neos API
//
export const initializeJsAPI = (parent: {[propName: string]: any}, {alias = 'neos', systemEnv = 'Development', routes}: {alias: string, systemEnv: string, routes: Routes}) => {
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
    get(alias: string = 'neos', ctx: {[propName: string]: any} = window): any {
        return ctx[alias];
    }
};

//
// Expose a method to create API plugins
//
export const createPlugin = (identifier: string, factory: any) => {
    factory.identifier = identifier;
    return factory;
};

//
// Expose fetchWithErrorHandling
//
export {fetchWithErrorHandling};
