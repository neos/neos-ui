import * as operations from './Operations/index';
import {$get} from 'plow-js';
import fetchWithErrorHandling from '../FetchWithErrorHandling/index';
import {Node, NodeContextPath, ContextProperties} from '@neos-project/neos-ts-interfaces';
import {Routes} from '../Endpoints';

const isOperation = (operation: any): operation is OperationDescriptor => Boolean(operation && operation.type !== undefined && operation.payload !== undefined);
export const isStartingOperation = (operation: unknown) => isOperation(operation) && operation.type === 'createContext';
export const isFinishingOperation = (operation = {}) => isOperation(operation) && ['get', 'getForTree', 'count', 'getForTreeWithParents'].indexOf(operation.type) !== -1;

export const isNodeEnvelope = (envelope: any): envelope is NodeEnvelope =>
    typeof envelope === 'object' && !Array.isArray(envelope) && typeof envelope.$node !== 'undefined';

interface NodeEnvelope extends Node {
    $node: NodeContextPath;
}

interface OperationDescriptor {
    type: string;
    payload: any;
}

type Operation = (chain?: Chain) => (...opts: any[]) => OperationDescriptor;
type Chain = OperationDescriptor[];

type Middleware = (chain: Chain, operation: OperationDescriptor) => OperationDescriptor;

interface Api {
    [propName: string]: any;
}

export const createNodeEnvelope = (node: NodeEnvelope | NodeContextPath) => {
    let contextPath = '';

    if (typeof node === 'object') {
        contextPath = $get(['contextPath'], node) || $get(['$node'], node);
    } else if (typeof node === 'string') {
        contextPath = node;
    }

    if (!contextPath) {
        throw new Error('A FlowQuery context must either be a string, an object with a contextPath property or an array of those items.');
    }

    return {$node: contextPath};
};

export const resolveChain = (chain: unknown[], routes: Routes) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
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
export default (routes: Routes) => {
    const middlewares: Middleware[] = [];

    //
    // Helper function which calls all registered middleswares when calling the API.
    //
    const applyMiddleware = (chain: Chain, operation: OperationDescriptor) => middlewares.reduce(
        (operation, middleware) => middleware(chain, operation),
        operation
    );

    //
    // Recursive function which will chain the middleware functions recursivly.
    //
    const createChainableApi = (operations: {[propName: string]: Operation}, chain: Chain, ignoreMiddleware: boolean) => Object.keys(operations).reduce(
        (api: Api, operationKey: string) => {
            api[operationKey] = (...args: any[]) => {
                const result = ignoreMiddleware ? operations[operationKey](chain)(...args) : applyMiddleware(
                    chain,
                    operations[operationKey](chain)(...args)
                );

                if (isStartingOperation(result)) {
                    return createChainableApi(operations, [result], ignoreMiddleware);
                }

                if (isFinishingOperation(result)) {
                    return resolveChain([...chain, result], routes);
                }

                return createChainableApi(operations, [...chain, result], ignoreMiddleware);
            };

            return api;
        },
        {}
    );

    //
    // The main API factory which will return it's own mechanism as well as the chained middlewares.
    //
    const q = (context: ContextProperties | string, ignoreMiddleware: boolean = false) => {
        let finalContext: NodeContextPath[];
        if (typeof context === 'object' && typeof $get(['contextPath'], context) === 'string') {
            finalContext = [$get(['contextPath'], context) as string];
        } else if (typeof context === 'string') {
            finalContext = [context];
        } else if (Array.isArray(context)) {
            finalContext = context;
        } else {
            throw new Error('Please provide either a string, an array or an object containing a `contextPath` to the FlowQuery API.');
        }

        const chain = [
            {
                type: 'createContext',
                payload: finalContext.map(createNodeEnvelope)
            }
        ];

        return createChainableApi(operations, chain, ignoreMiddleware);
    };

    //
    // Expose the middleware mechanism.
    //
    q.applyMiddleware = (middleware: Middleware) => middlewares.push(middleware);

    return q;
};
