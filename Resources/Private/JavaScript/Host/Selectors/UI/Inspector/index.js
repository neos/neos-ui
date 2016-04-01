import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {Nodes} from '../../CR/index';

export const currentValue = createSelector(
    [
        Nodes.focusedSelector,
        $get('ui.inspector.valuesByNodePath')
    ],
    (focusedNode, transientValuesByNodePath) => propertyId => {
        const transientValue = $get([focusedNode.contextPath, 'nodeProperties', propertyId], transientValuesByNodePath);
        const originalValue = focusedNode.properties[propertyId];

        return transientValue || originalValue;
    }
);

export const currentImageValue = createSelector(
    [
        Nodes.focusedSelector,
        $get('ui.inspector.valuesByNodePath'),
        $get('cr.images.byUuid')
    ],
    (focusedNode, transientValuesByNodePath, imagesByUuid) => imageUuid => {
        const transientValue = $get([focusedNode.contextPath, 'images', imageUuid], transientValuesByNodePath);
        const originalValue = $get([imageUuid], imagesByUuid);

        return transientValue || originalValue;
    }
);
