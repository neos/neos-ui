import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

export const byNameSelector = state => name => $get(['cr', 'nodeTypes', 'byName', name], state);

export const subTypesSelector = name => $get(['cr', 'nodeTypes', 'inheritanceMap', 'subTypes', name]);

export const isOfTypeSelector = defaultMemoize(
    superTypeName => subTypeName => createSelector(
        [
            subTypesSelector(superTypeName)
        ],
        subTypes => subTypes.indexOf(subTypeName) !== -1
    )
);
