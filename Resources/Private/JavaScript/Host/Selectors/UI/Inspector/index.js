import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {Nodes} from '../../CR/';

export const currentValue = createSelector(
    [
        Nodes.focusedSelector,
        $get('ui.inspector.valuesByNodePath')
    ],
    (focusedNode, transientValuesByNodePath) => propertyId => {
        const transientValue = $get([focusedNode.contextPath, propertyId], transientValuesByNodePath);
        const originalValue = focusedNode.properties[propertyId];

        return transientValue || originalValue;
    }
);
