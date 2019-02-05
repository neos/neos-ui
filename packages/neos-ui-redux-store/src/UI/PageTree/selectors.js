import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {siteNodeSelector} from '../../CR/Nodes/selectors';
import {isNodeCollapsed} from '../../CR/Nodes/helpers';

export const getFocused = $get('ui.pageTree.isFocused');
export const getToggled = $get('ui.pageTree.toggled');
export const getLoading = $get('ui.pageTree.loading');
export const getErrors = $get('ui.pageTree.errors');
export const getHidden = $get('ui.pageTree.hidden');
export const getIntermediate = $get('ui.pageTree.intermediate');

export const getIsLoading = createSelector(
    [
        getLoading
    ],
    list => Boolean(list.size)
);

export const getUncollapsed = createSelector(
    [
        getToggled,
        $get('cr.nodes.byContextPath'),
        siteNodeSelector,
        (_, {loadingDepth = 0}) => loadingDepth
    ],
    (toggleTreeNodeContextPaths, nodesByContextPath, siteNode, loadingDepth) => {
        return nodesByContextPath.filter(
            node => !isNodeCollapsed(
                node,
                toggleTreeNodeContextPaths.includes($get('contextPath', node)),
                siteNode,
                loadingDepth
            )
        ).map($get('contextPath')).toArray();
    }
);
