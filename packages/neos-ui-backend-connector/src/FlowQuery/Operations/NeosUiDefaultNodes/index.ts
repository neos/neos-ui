import {NodeTypeName, NodeContextPath} from '@neos-project/neos-ts-interfaces';

export default () => (baseNodeType: NodeTypeName, loadingDepth: number | undefined, toggledNodes: NodeContextPath[], clipboardNodeContextPath: NodeContextPath) => ({
    type: 'neosUiDefaultNodes',
    payload: [baseNodeType, loadingDepth, toggledNodes, clipboardNodeContextPath]
});
