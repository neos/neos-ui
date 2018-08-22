import {$get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {createSelector} from 'reselect';
import {fromJSOrdered} from '@neos-project/utils-helpers';

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

//
// Export the reducer
//
export const reducer = handleActions({});

const contextForNodeLinking = createSelector(
    [
        $get('cr.workspaces.personalWorkspace.name'),
        $get('cr.nodes.siteNode'),
        $get('cr.contentDimensions.active')
    ],
    (
        activeWorkspace,
        siteNodePath,
        activeContentDimensions
    ) => {
        return fromJSOrdered({
            workspaceName: activeWorkspace,
            contextNode: siteNodePath,
            dimensions: activeContentDimensions
        });
    }
);

//
// Export the selectors
//
export const selectors = {
    contextForNodeLinking
};
