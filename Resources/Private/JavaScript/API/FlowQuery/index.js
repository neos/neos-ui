import * as operations from './Operations/';
import {$add, $pop, $last} from 'plow-js';

const isStartingOperation = operation => operation.type === 'CREATE_CONTEXT';
const isFinishingOperation = operation => ['GET', 'COUNT'].indexOf(operation.type) !== -1;

const createNodeEnvelope = node => {
    let contextPath = '';

    if (typeof node === 'object' && !Array.isArray(node)) {
        if (node.contextPath) {
            contextPath = node.contextPath;
        } else if (node.$node) {
            contextPath = node.$node;
        }
    } else if (typeof node === 'string') {
        contextPath = node;
    }

    if (!contextPath) {
        throw new Error('A FlowQuery context must either be a string, an object with a contextPath property or an array of those items.');
    }

    return {$node: contextPath};
};

const isNodeEnvelope = envelope =>
    typeof envelope === 'object' && !Array.isArray(envelope) && typeof envelope.$node !== 'undefined';

//
// The core FlowQuery plugin
//
export default (csrfToken) => {
    const middlewares = [];
    const resolveChain = chain => {
        const finisher = $last('chain', {chain});
        const lastOperation = $last('chain', $pop('chain', {chain}));

        if (isStartingOperation(lastOperation)) {
            const context = lastOperation.payload;
            const nodes = context.filter(node => !isNodeEnvelope(node));
            const envelopes = context.filter(isNodeEnvelope);

            if (envelopes.length === 0) {
                return Promise.resolve(nodes);
            }

            console.log('would fetch remaining nodes now', envelopes);
        } else {
            return fetch('/che!/service/flow-query', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Flow-Csrftoken': csrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({chain})
            })
            .then(response => response.json());
        }
    };
    const applyMiddleware = (chain, operation) => middlewares.reduce(
        (operation, middleware) => middleware(chain, operation),
        operation
    );
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
                    return resolveChain($add('chain', result, {chain}).chain);
                }

                return createChainableApi(operations, $add('chain', result, {chain}).chain, ignoreMiddleware);
            };

            return api;
        },
        {}
    );
    const q = (context, ignoreMiddleware = false) => {
        if (typeof context === 'object' && !Array.isArray(context) && context.contextPath) {
            context = [context.contextPath];
        } else if (typeof context === 'string') {
            context = [context];
        }

        const chain = [
            {
                type: 'CREATE_CONTEXT',
                payload: context.map(createNodeEnvelope)
            }
        ];

        return createChainableApi(operations, chain, ignoreMiddleware);
    };

    //
    // The middleware mechanism
    //
    q.applyMiddleware = middleware => middlewares.push(middleware);

    return q;
};
