import {$get} from 'plow-js';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class NodeTypesRegistry extends SynchronousRegistry {
    _constraints = [];
    _inheritanceMap = [];
    _groups = [];

    setConstraints(constraints) {
        this._constraints = constraints;
    }

    setInheritanceMap(inheritanceMap) {
        this._inheritanceMap = inheritanceMap;
    }

    setGroups(groups) {
        this._groups = groups;
    }

    getAllowedChildNodeTypes(nodeTypeName) {
        const result = $get([nodeTypeName, 'nodeTypes'], this._constraints);

        return Object.keys(result || []);
    }

    getAllowedGrandChildNodeTypes(nodeTypeName, childNodeName) {
        const result = $get([nodeTypeName, 'childNodes', childNodeName, 'nodeTypes'], this._constraints);

        return Object.keys(result || []);
    }

    getGroupedNodeTypeList(nodeTypeFilter) {
        const nodeTypes = nodeTypeFilter ? Object.values(this._registry).filter(nodeType => {
            return nodeTypeFilter.indexOf(nodeType.name) !== -1;
        }) : Object.values(this._registry);

        // Distribute nodetypes into groups
        const groups = nodeTypes.reduce((groups, nodeType) => {
            // Fallback to 'general' group
            const groupName = nodeType.ui && nodeType.ui.group ? nodeType.ui.group : 'general';
            if (groupName in this._groups) {
                const group = groups[groupName] || Object.assign({}, this._groups[groupName]);

                if (!group.nodeTypes) {
                    group.nodeTypes = [];
                }
                group.nodeTypes.push(nodeType);
                groups[groupName] = group;
            }

            return groups;
        }, {});

        // Sort both groups and nodetypes within the group and return as array
        return Object.keys(groups).map(i => {
            if (groups[i].nodeTypes) {
                groups[i].nodeTypes.sort((a, b) => a.ui.position > b.ui.position ? 1 : -1);
            }
            groups[i].name = i;
            return groups[i];
        }).filter(i => i.nodeTypes).sort((a, b) => a.position > b.position ? 1 : -1);
    }

    isOfType(nodeTypeName, referenceNodeTypeName) {
        if (nodeTypeName === referenceNodeTypeName) {
            return true;
        }

        return this.inheritanceMap.subTypes[referenceNodeTypeName].indexOf(nodeTypeName) !== -1;
    }
}
