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

export const allowedChildNodeTypesSelector = state => nodeTypeName => {
    const nodeTypes = $get(['cr', 'nodeTypes', 'constraints', nodeTypeName, 'nodeTypes'], state);
    return nodeTypes ? Object.keys(nodeTypes) : [];
};

export const allowedChildNodeTypesForAutocreatedNodeSelector = state => (nodeTypeName, autoCreatedNodeName) => {
    const nodeTypes = $get(['cr', 'nodeTypes', 'constraints', nodeTypeName, 'childNodes', autoCreatedNodeName, 'nodeTypes'], state);
    return nodeTypes ? Object.keys(nodeTypes) : [];
};

export const nodeTypeGroupsSelector = $get('cr.nodeTypes.groups');
