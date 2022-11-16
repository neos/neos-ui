import {createSelector} from 'reselect';
import {personalWorkspaceNameSelector} from '../../CR/Workspaces/selectors';
import {siteNodeContextPathSelector} from '../../CR/Nodes/selectors';
import {selectors as CDSelectors} from '../../CR/ContentDimensions/index';

//
// Export the action types
//
export const actionTypes = {
};

//
// Export the actions
//
export const actions = {
};

const contextForNodeLinking = createSelector(
    [
        personalWorkspaceNameSelector,
        siteNodeContextPathSelector,
        CDSelectors.active
    ],
    (
        activeWorkspace,
        siteNodePath,
        activeContentDimensions
    ) => {
        return {
            workspaceName: activeWorkspace,
            contextNode: siteNodePath,
            dimensions: activeContentDimensions
        };
    }
);

//
// Export the selectors
//
export const selectors = {
    contextForNodeLinking
};
