import {$get, $set} from 'plow-js';
import {produce} from 'immer';
import {Node, NodeChild} from '@neos-project/neos-ts-interfaces';

type Context = {
    node: NodeChild
    parentNode: Node
}

type ViewConfiguration = Record<string, any>

export default function preprocessNodeConfiguration(
    context: Context,
    path: Array<string>,
    viewConfiguration: ViewConfiguration,
    originalViewConfiguration: ViewConfiguration
) {
    const currentLevel = path.length === 0 ? viewConfiguration : $get(path, viewConfiguration);
    Object.keys(currentLevel).forEach(propertyName => {
        const propertyValue = currentLevel[propertyName];
        const newPath = [...path, propertyName];
        const originalPropertyValue = $get(newPath, originalViewConfiguration);

        if (propertyValue !== null && typeof propertyValue === 'object') {
            viewConfiguration = preprocessNodeConfiguration(context, newPath, viewConfiguration, originalViewConfiguration);
        } else if (typeof originalPropertyValue === 'string' && originalPropertyValue.indexOf('ClientEval:') === 0) {
            const {node, parentNode} = context;
            try {
                // eslint-disable-next-line no-new-func
                const evaluatedValue = new Function('node,parentNode', 'return ' + originalPropertyValue.replace('ClientEval:', ''))(node, parentNode);
                if (evaluatedValue !== propertyValue) {
                    viewConfiguration = produce(
                        viewConfiguration,
                        draft => {
                            return $set(newPath, evaluatedValue, draft);
                        }
                    );
                }
            } catch (e) {
                console.warn('An error occurred while trying to evaluate "' + originalPropertyValue + '"\n', e);
            }
        }
    });

    return viewConfiguration;
}
