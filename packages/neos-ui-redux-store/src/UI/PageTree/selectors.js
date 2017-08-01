import {$get} from 'plow-js';
import {createSelector} from 'reselect';

export const getFocused = $get('ui.pageTree.isFocused');
export const getToggled = $get('ui.pageTree.toggled');
export const getLoading = $get('ui.pageTree.loading');
export const getErrors = $get('ui.pageTree.errors');

export const getIsLoading = createSelector(
    [
        getLoading
    ],
    list => Boolean(list.size)
);
