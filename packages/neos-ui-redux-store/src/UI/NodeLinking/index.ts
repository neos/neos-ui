import {createSelector} from 'reselect';
import {personalWorkspaceNameSelector} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces/selectors';
import {siteNodeContextPathSelector} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/selectors';
import {selectors as CDSelectors} from '@neos-project/neos-ui-redux-store/src/CR/ContentDimensions/index';

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
