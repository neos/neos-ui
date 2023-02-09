import {Node, NodeChild} from '@neos-project/neos-ts-interfaces';

type ViewConfiguration = Record<string, any>;

export default function preprocessNodeConfiguration(
    context: { node: NodeChild, parentNode: Node },
    configuration: ViewConfiguration,
): ViewConfiguration {
    return Object.keys(configuration).reduce((currentConfiguration, propertyName) => {
        const propertyValue = currentConfiguration[propertyName];

        if (propertyValue !== null && typeof propertyValue === 'object') {
            return {
                ...currentConfiguration,
                [propertyName]: preprocessNodeConfiguration(context, propertyValue)
            };
        }

        if (typeof propertyValue === 'string' && propertyValue.startsWith('ClientEval:')) {
            const {node, parentNode} = context;
            try {
                // eslint-disable-next-line no-new-func
                const evaluateFn = new Function('node,parentNode', 'return ' + propertyValue.replace('ClientEval:', ''));

                return {
                    ...currentConfiguration,
                    [propertyName]: evaluateFn(node, parentNode)
                };
            } catch (e) {
                console.warn('An error occurred while trying to evaluate "' + propertyValue + '"\n', e);
            }
        }

        // return the propertyValue when nothing needs to be done or something went wrong during ClientEval
        return currentConfiguration;
    }, configuration);
}
