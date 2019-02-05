import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import * as operations from './Operations/index';
import {$get, $add} from 'plow-js';
import fetchWithErrorHandling from '../FetchWithErrorHandling/index';

export const isStartingOperation = (operation = {}) => operation.type === 'createContext';
export const isFinishingOperation = (operation = {}) => ['get', 'getForTree', 'count', 'getForTreeWithParents'].indexOf(operation.type) !== -1;

export const isNodeEnvelope = envelope =>
    typeof envelope === 'object' && !Array.isArray(envelope) && typeof envelope.$node !== 'undefined';

export const createNodeEnvelope = (node = {}) => {
    let contextPath = '';

    if (isObject(node)) {
        contextPath = $get('contextPath', node) || $get('$node', node);
    } else if (isString(node)) {
        contextPath = node;
    }

    if (!contextPath) {
        throw new Error('A FlowQuery context must either be a string, an object with a contextPath property or an array of those items.');
    }

    return {$node: contextPath};
};

export const resolveChain = (chain, routes) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
    url: routes.ui.service.flowQuery,

    method: 'POST',
    credentials: 'include',
    headers: {
        'X-Flow-Csrftoken': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({chain})
})).then(response => response && response.json());

//
// The core FlowQuery plugin
//
export default routes => {
    const middlewares = [];

    //
    // Helper function which calls all registered middleswares when calling the API.
    //
    const applyMiddleware = (chain, operation) => middlewares.reduce(
        (operation, middleware) => middleware(chain, operation),
        operation
    );

    //
    // Recursive function which will chain the middleware functions recursivly.
    //
    const createChainableApi = (operations, chain, ignoreMiddleware) => Object.keys(operations).reduce(
        (api, operationKey) => {
            api[operationKey] = (...args) => {
                const result = ignoreMiddleware ? operations[operationKey](chain)(...args) : applyMiddleware(
                    chain,
                    operations[operationKey](chain)(...args)
                );

                if (isStartingOperation(result)) {
                    return createChainableApi(operations, [result], ignoreMiddleware);
                }

                if (isFinishingOperation(result)) {
                    return resolveChain($add('chain', result, {chain}).chain, routes);
                }

                return createChainableApi(operations, $add('chain', result, {chain}).chain, ignoreMiddleware);
            };

            return api;
        },
        {}
    );

    //
    // The main API factory which will return it's own mechanism as well as the chained middlewares.
    //
    const q = (context, ignoreMiddleware = false) => {
        if (isObject(context) && $get('contextPath', context)) {
            context = [$get('contextPath', context)];
        } else if (isString(context)) {
            context = [context];
        }

        if (!Array.isArray(context)) {
            throw new Error('Please provide either a string, an array or an object containing a `contextPath` to the FlowQuery API.');
        }

        const chain = [
            {
                type: 'createContext',
                payload: context.map(createNodeEnvelope)
            }
        ];

        return createChainableApi(operations, chain, ignoreMiddleware);
    };

    //
    // Expose the middleware mechanism.
    //
    q.applyMiddleware = middleware => middlewares.push(middleware);

    return q;
};
