import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

export const hasNestedNodes = (focusedNodesContextPaths: NodeContextPath[]) => {
    return !focusedNodesContextPaths.every((contextPathA: NodeContextPath) => {
        const path = contextPathA.split('@')[0];
        // TODO: adjust this for the new CR when this is merged: https://github.com/neos/neos-ui/pull/2178
        return focusedNodesContextPaths.every((contextPathB: NodeContextPath) => !(contextPathB.indexOf(path) === 0 && contextPathA !== contextPathB));
    });
};
