import {NodeTypeName, NodeContextPath} from '@neos-project/neos-ts-interfaces';

export default () => (baseNodeType: NodeTypeName, loadingDepth: number | undefined, toggledNodes: NodeContextPath[], clipboardNodesContextPaths: NodeContextPath[]) => ({
    type: 'neosUiDefaultNodes',
    payload: [baseNodeType, loadingDepth, toggledNodes, clipboardNodesContextPaths]
});
