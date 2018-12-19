import {$get} from 'plow-js';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {createSelector} from 'reselect';

import {siteNodeSelector, nodesByContextPathSelector} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/selectors';
import {isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

export const getFocused = (state: GlobalState) => $get(['ui', 'pageTree', 'isFocused'], state);
export const getToggled = (state: GlobalState) => $get(['ui', 'pageTree', 'toggled'], state);
export const getLoading = (state: GlobalState) => $get(['ui', 'pageTree', 'loading'], state);
export const getErrors = (state: GlobalState) => $get(['ui', 'pageTree', 'errors'], state);
export const getHidden = (state: GlobalState) => $get(['ui', 'pageTree', 'hidden'], state);
export const getIntermediate = (state: GlobalState) => $get(['ui', 'pageTree', 'intermediate'], state);

export const getIsLoading = createSelector(
    [
        getLoading
    ],
    list => Boolean(list.length)
);

export const getUncollapsed = createSelector(
    [
        getToggled,
        nodesByContextPathSelector,
        siteNodeSelector,
        (_: GlobalState, {loadingDepth = 0}) => loadingDepth
    ],
    (toggleTreeNodeContextPaths, nodesByContextPath, siteNode, loadingDepth) => Object.keys(nodesByContextPath).filter(contextPath => {
        const node = nodesByContextPath[contextPath];
        if (!node || !siteNode) {
            return false;
        }
        return !isNodeCollapsed(
            node,
            toggleTreeNodeContextPaths.includes(contextPath),
            siteNode,
            loadingDepth
        );
    })
);

export const selectors = {};
