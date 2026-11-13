import {Node} from '@neos-project/neos-ts-interfaces';
import {NodeTypesRegistry} from '@neos-project/neos-ui-contentrepository';

//
// Determine whether the given node is a content collection that has no children yet
//
const isEmptyContentCollection = (focusedNode: Node | undefined, nodeTypesRegistry: NodeTypesRegistry): boolean => {
    if (!focusedNode) {
        return false;
    }

    return nodeTypesRegistry.hasRole(focusedNode.nodeType, 'contentCollection')
        && Boolean(focusedNode.isFullyLoaded)
        && (focusedNode.children?.length ?? 0) === 0;
};

export default isEmptyContentCollection;
