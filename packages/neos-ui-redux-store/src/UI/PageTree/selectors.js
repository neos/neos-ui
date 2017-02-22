import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {selectors as nodes} from '../../CR/Nodes/index';
import {getCurrentContentCanvasContextPath} from './../ContentCanvas/selectors';

export const getFocused = $get('ui.pageTree.isFocused');
export const getUncollapsed = $get('ui.pageTree.uncollapsed');
export const getLoading = $get('ui.pageTree.loading');
export const getErrors = $get('ui.pageTree.errors');

export const getFocusedNodeContextPathSelector = createSelector(
    [
        getFocused
    ],
    focusedNodeContextPath => focusedNodeContextPath
);

export const getUncollapsedContextPaths = createSelector(
    [
        getUncollapsed
    ],
    list => list.toJS()
);

export const getIsLoading = createSelector(
    [
        getLoading
    ],
    list => Boolean(list.toJS().length)
);
