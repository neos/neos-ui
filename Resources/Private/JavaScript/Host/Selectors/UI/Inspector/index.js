import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {Nodes} from '../../CR/index';

export const currentValue = createSelector(
    [
        Nodes.focusedSelector,
        $get('ui.inspector.valuesByNodePath')
    ],
    (focusedNode, transientValuesByNodePath) => propertyId => {
        const focusedNodeContextPath = $get('contextPath', focusedNode);
        const transientValue = $get([focusedNodeContextPath, 'nodeProperties', propertyId], transientValuesByNodePath);
        const originalValue = $get(['properties', propertyId], focusedNode);

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
        const focusedNodeContextPath = $get('contextPath', focusedNode);
        const transientValue = $get([focusedNodeContextPath, 'images', imageUuid], transientValuesByNodePath);
        const originalValue = $get([imageUuid], imagesByUuid);

        return transientValue || originalValue;
    }
);
