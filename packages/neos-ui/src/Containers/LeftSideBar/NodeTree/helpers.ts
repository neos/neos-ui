import {NodeContextPath} from '@neos-project/neos-ts-interfaces';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

function findRootline(contextPath: NodeContextPath, state: GlobalState): string[] {
    const node = state.cr.nodes.byContextPath[contextPath];
    if (node && node.parent) {
        return [...findRootline(node.parent, state), node.identifier];
    }
    return [];
}

// NOTE: it would be useful to extract the method below into a selector,
// because right now it is called for EVERY node in the tree.
export const hasNestedNodes = (focusedNodesContextPaths: NodeContextPath[], state: GlobalState) => {
    const identifierRootlinesOfFocusedNodes = focusedNodesContextPaths.map((contextPath: NodeContextPath) => findRootline(contextPath, state).join('/'));

    return !identifierRootlinesOfFocusedNodes.every((pathA: string) => {
        return identifierRootlinesOfFocusedNodes.every((pathB: string) => !(pathB.indexOf(pathA) === 0 && pathA !== pathB));
    });
};
