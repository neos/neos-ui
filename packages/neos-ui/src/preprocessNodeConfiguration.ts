import produce from 'immer';
import {Node, NodeChild} from '@neos-project/neos-ts-interfaces';

// FIXME: We do not have better typings for this yet
type NodeConfiguration = Record<string, any>;

export default function preprocessNodeConfiguration(
    // FIXME: Create better Node typings (Inspector has a real Node while CreationDialog has a transientNode)
    context: { node: NodeChild, parentNode: Node },
    configuration: NodeConfiguration,
): NodeConfiguration {
    return Object.keys(configuration).reduce((config, propertyKey) => {
        const propertyValue = config[propertyKey];

        if (propertyValue !== null && typeof propertyValue === 'object') {
            return produce(
                config,
                draft => {
                    draft[propertyKey] = preprocessNodeConfiguration(context, propertyValue);
                }
            );
        }

        if (typeof propertyValue === 'string' && propertyValue.startsWith('ClientEval:')) {
            try {
                // eslint-disable-next-line no-new-func
                const evaluateFn = new Function('node,parentNode', 'return ' + propertyValue.replace('ClientEval:', ''));
                const {node, parentNode} = context;
                const evaluatedValue = evaluateFn(node, parentNode);

                return produce(
                    config,
                    draft => {
                        draft[propertyKey] = evaluatedValue;
                    }
                );
            } catch (e) {
                console.warn('An error occurred while trying to evaluate "' + propertyValue + '"\n', e);
            }
        }

        // return the propertyValue when nothing needs to be done or something went wrong during ClientEval
        return config;
    }, configuration);
}
