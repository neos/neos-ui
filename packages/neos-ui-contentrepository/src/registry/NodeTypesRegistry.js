import {map, mapObjIndexed, values, sort, compose} from 'ramda';
import {$get, $transform} from 'plow-js';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class NodeTypesRegistry extends SynchronousRegistry {
    _constraints = [];
    _inheritanceMap = [];
    _groups = [];
    _roles = [];

    _inspectorViewConfigurationCache = {};

    setConstraints(constraints) {
        this._constraints = constraints;
    }

    setInheritanceMap(inheritanceMap) {
        this._inheritanceMap = inheritanceMap;
    }

    setGroups(groups) {
        this._groups = groups;
    }

    setRoles(roles) {
        this._roles = roles;
    }

    getRole(roleName) {
        return this._roles[roleName];
    }

    hasRole(nodeTypeName, roleName) {
        return this.isOfType(nodeTypeName, this.getRole(roleName));
    }

    getAllowedChildNodeTypes(nodeTypeName) {
        const result = $get([nodeTypeName, 'nodeTypes'], this._constraints);

        return Object.keys(result || []).filter(key => result[key]);
    }

    getAllowedGrandChildNodeTypes(nodeTypeName, childNodeName) {
        const result = $get([nodeTypeName, 'childNodes', childNodeName, 'nodeTypes'], this._constraints);

        return Object.keys(result || []).filter(key => result[key]);
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
                groups[i].nodeTypes.sort((a, b) => $get('ui.position', a) > $get('ui.position', b) ? 1 : -1);
            }
            groups[i].name = i;
            return groups[i];
        }).filter(i => i.nodeTypes).sort((a, b) => $get('position', a) > $get('position', b) ? 1 : -1);
    }

    isOfType(nodeTypeName, referenceNodeTypeName) {
        if (nodeTypeName === referenceNodeTypeName) {
            return true;
        }

        return this._inheritanceMap.subTypes[referenceNodeTypeName].indexOf(nodeTypeName) !== -1;
    }

    getSubTypesOf(nodeTypeName) {
        return this._inheritanceMap.subTypes[nodeTypeName];
    }

    getInspectorViewConfigurationFor(nodeTypeName) {
        const nodeType = this._registry[nodeTypeName];

        if (!nodeType) {
            return undefined;
        }

        if (this._inspectorViewConfigurationCache[nodeTypeName]) {
            return this._inspectorViewConfigurationCache[nodeTypeName];
        }

        const withId = mapObjIndexed((subject, id) => ({
            ...subject,
            id
        }));
        const getPosition = subject => ($get(['ui', 'inspector', 'position'], subject) || $get(['ui', 'position'], subject) || $get('position', subject));
        const positionalArraySorter = sort((a, b) => (getPosition(a) - getPosition(b)) || (a.id - b.id));
        const getNormalizedDeepStructureFromNodeType = path => compose(
            positionalArraySorter,
            values,
            withId,
            $get(path)
        );
        const tabs = getNormalizedDeepStructureFromNodeType('ui.inspector.tabs')(nodeType);
        const groups = getNormalizedDeepStructureFromNodeType('ui.inspector.groups')(nodeType);
        const properties = getNormalizedDeepStructureFromNodeType('properties')(nodeType);

        const viewConfiguration = {
            tabs: map(
                tab => ({
                    ...tab,
                    groups: map(
                        group => ({
                            ...group,
                            properties: map(
                                $transform({
                                    id: $get('id'),
                                    label: $get('ui.label'),
                                    editor: $get('ui.inspector.editor'),
                                    editorOptions: $get('ui.inspector.editorOptions')
                                }),
                                properties.filter(p => $get('ui.inspector.group', p) === group.id)
                            )
                        }),
                        groups.filter(g => {
                            const isMatch = g.tab === tab.id;
                            const isDefaultTab = !g.tab && tab.id === 'default';

                            return isMatch || isDefaultTab;
                        })
                    )
                }),
                tabs
            )
        };

        this._inspectorViewConfigurationCache[nodeTypeName] = viewConfiguration;

        return viewConfiguration;
    }
}
