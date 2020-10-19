import {merge, mapValues} from 'lodash';
import {$get} from 'plow-js';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import positionalArraySorter from '@neos-project/positional-array-sorter';
import {NodeTypeName, NodeType} from '@neos-project/neos-ts-interfaces';

interface Constraint {
    childNodes: {
        [nodeTypeName: string]: Constraint | undefined;
    };
    nodeTypes: {
        [nodeTypeName: string]: boolean | undefined;
    };
}
interface ConstraintsMap {
    [nodeTypeName: string]: Constraint | undefined;
}
interface InheritanceMap {
    subTypes: {
        [nodeTypeName: string]: NodeTypeName[] | undefined;
    };
}

interface Group {
    label: string;
    position?: number;
}
interface GroupsMap {
    [groupName: string]: Group;
}
interface RolesMap {
    [roleName: string]: string | undefined;
}
interface GroupedNodeTypeListItem extends Group {
    name: string;
    nodeTypes: NodeType[];
}

interface ViewConfiguration {
    [prop: string]: any;
}
// We have to use a custom type guard in order to filter out null values, see https://codereview.stackexchange.com/a/184004
const isGroupedNodeTypeListItem = (str: GroupedNodeTypeListItem | null): str is GroupedNodeTypeListItem => !!str;

export default class NodeTypesRegistry extends SynchronousRegistry<NodeType> {
    private _constraints: ConstraintsMap = {};

    private _inheritanceMap: InheritanceMap = {
        subTypes: {}
    };

    private _groups: GroupsMap = {};

    private _roles: RolesMap = {};

    private _defaultInlineEditor = 'ckeditor';

    private _inspectorViewConfigurationCache: {[propName: string]: any} = {};

    public setConstraints (constraints: ConstraintsMap): void {
        this._constraints = constraints;
    }

    public setInheritanceMap(inheritanceMap: InheritanceMap): void {
        this._inheritanceMap = inheritanceMap;
    }

    public setGroups(groups: GroupsMap): void {
        this._groups = groups;
    }

    public setRoles(roles: RolesMap): void {
        this._roles = roles;
    }

    public getRole(roleName: string): string | null {
        return this._roles[roleName] || null;
    }

    public setDefaultInlineEditor(defaultInlineEditor: string): void {
        if (defaultInlineEditor) {
            this._defaultInlineEditor = defaultInlineEditor;
        }
    }

    public getDefaultInlineEditor(): string {
        return this._defaultInlineEditor;
    }

    public hasRole(nodeTypeName: string, roleName: string): boolean {
        const role = this.getRole(roleName);
        if (role) {
            return this.isOfType(nodeTypeName, role);
        } else {
            return false;
        }
    }

    public getAllowedChildNodeTypes(nodeTypeName: string): NodeTypeName[] {
        const constraint = this._constraints[nodeTypeName];
        if (constraint) {
            const result = this._constraints[nodeTypeName] && constraint.nodeTypes;
            return Object.keys(result || []).filter(key => result && result[key] && this.has(key), this);
        }
        return [];
    }

    public getAllowedGrandChildNodeTypes(nodeTypeName: string, childNodeName: string): NodeTypeName[] {
        const constraint = this._constraints[nodeTypeName];
        if (constraint) {
            const childConstraint = constraint.childNodes[childNodeName];
            if (childConstraint) {
                const result = childConstraint.nodeTypes;
                return Object.keys(result || {}).filter(key => result[key] && this.has(key), this);
            }
        }
        return [];
    }

    public getAllowedNodeTypesTakingAutoCreatedIntoAccount(isSubjectNodeAutocreated: boolean, referenceParentName: string, referenceParentNodeType: string, referenceGrandParentNodeType: string, role: string): NodeTypeName[] {
        let result;
        if (isSubjectNodeAutocreated) {
            if (!referenceGrandParentNodeType) {
                return [];
            }
            result = this.getAllowedGrandChildNodeTypes(referenceGrandParentNodeType, referenceParentName);
        } else {
            result = this.getAllowedChildNodeTypes(referenceParentNodeType);
        }

        // If role is provided, filter by role, e.g. only "content" or "document" ndoetypes
        return role ? result.filter(nodeTypeName => this.hasRole(nodeTypeName, role)) : result;
    }

    public getNodeType(nodeTypeName: NodeTypeName): NodeType | null {
        return this.get(nodeTypeName);
    }

    public getGroupedNodeTypeList(nodeTypeFilter?: NodeTypeName[]): GroupedNodeTypeListItem[] {
        const nodeTypesWrapped = nodeTypeFilter ? this._registry.filter(nodeType => nodeTypeFilter.indexOf(nodeType.key) !== -1) : this._registry;
        const nodeTypes = nodeTypesWrapped.map(item => item.value) as NodeType[];

        // It's important to preserve the ordering of `this._groups` as we can't sort them again by position in JS (sorting logic is too complex)
        return Object.keys(this._groups).map(groupName => {
            // If a nodetype does not have group defined it means it's a system nodetype like "unstrctured"
            const nodesForGroup = nodeTypes
                // Filter by current group
                .filter(i => i && i.ui && i.ui.group === groupName);
            const nodesForGroupSorted = positionalArraySorter(nodesForGroup, (nodeType: any) => nodeType.ui && nodeType.ui.position, 'name');
            if (nodesForGroup.length > 0) {
                return Object.assign(
                    {},
                    this._groups[groupName],
                    {
                        nodeTypes: nodesForGroupSorted,
                        name: groupName
                    }
                );
            }
            return null;
        }).filter(isGroupedNodeTypeListItem);
    }

    public isOfType(nodeTypeName: NodeTypeName, referenceNodeTypeName: NodeTypeName): boolean {
        if (nodeTypeName === referenceNodeTypeName) {
            return true;
        }

        const inheritance = this._inheritanceMap.subTypes[referenceNodeTypeName];
        if (inheritance) {
            return inheritance.indexOf(nodeTypeName) !== -1;
        }
        return false;
    }

    public getSubTypesOf(nodeTypeName: NodeTypeName): NodeTypeName[] {
        return [nodeTypeName, ...this._inheritanceMap.subTypes[nodeTypeName] || []];
    }

    public getInspectorViewConfigurationFor(nodeTypeName: NodeTypeName): ViewConfiguration | null {
        const nodeType = this.get(nodeTypeName);

        if (!nodeType) {
            console.error('Missing nodetype:', nodeTypeName); // tslint:disable-line no-console
            return null;
        }

        if (this._inspectorViewConfigurationCache[nodeTypeName]) {
            return this._inspectorViewConfigurationCache[nodeTypeName];
        }

        const withId = <S>(state: {[propName: string]: S}): {[propName: string]: S & {id: string}} => mapValues(state, (subject, id) => Object.assign({}, subject, {id}));

        const _tabs = Object.values(withId($get(['ui', 'inspector', 'tabs'], nodeType) || {}));
        const tabs = positionalArraySorter(_tabs, 'position', 'id');

        const _groups = Object.values(withId($get(['ui', 'inspector', 'groups'], nodeType) || {}));
        const groups = positionalArraySorter(_groups, 'position', 'id');

        const _views = Object.values(withId($get(['ui', 'inspector', 'views'], nodeType) || {}));
        const views = positionalArraySorter(_views, 'position', 'id');

        const _properties = Object.values(withId($get(['properties'], nodeType) || {}));
        const properties = positionalArraySorter(_properties, 'position', 'id');

        const viewConfiguration = {
            tabs: tabs.map(tab => ({
                ...tab,
                groups: groups.filter(g => {
                    const isMatch = g.tab === tab.id;
                    const isDefaultTab = !g.tab && tab.id === 'default';

                    return isMatch || isDefaultTab;
                }).map(group => ({
                        ...group,
                        items: positionalArraySorter([
                            ...properties.filter(p => $get(['ui', 'inspector', 'group'], p) === group.id)
                                .map(property => ({
                                    type: 'editor',
                                    id: $get(['id'], property),
                                    label: $get(['ui', 'label'], property),
                                    editor: $get(['ui', 'inspector', 'editor'], property),
                                    editorOptions: $get(['ui', 'inspector', 'editorOptions'], property),
                                    position: $get(['ui', 'inspector', 'position'], property),
                                    hidden: $get(['ui', 'inspector', 'hidden'], property),
                                    helpMessage: $get(['ui', 'help', 'message'], property),
                                    helpThumbnail: $get(['ui', 'help', 'thumbnail'], property)
                                })
                            ),
                            ...views.filter(v => $get(['group'], v) === group.id)
                                .map(property => ({
                                    type: 'view',
                                    id: $get(['id'], property),
                                    label: $get(['label'], property),
                                    view: $get(['view'], property),
                                    viewOptions: $get(['viewOptions'], property),
                                    position: $get(['position'], property),
                                    helpMessage: $get(['helpMessage'], property)
                                })
                            )
                        ], 'position', 'id')
                    })
                )
            }))
        };

        this._inspectorViewConfigurationCache[nodeTypeName] = viewConfiguration;

        return viewConfiguration;
    }

    public getInlineEditorIdentifierForProperty(nodeTypeName: NodeTypeName, propertyName: string): string | null {
        const nodeType = this.get(nodeTypeName);

        if (!nodeType) {
            console.error('Nodetype not found', nodeTypeName); // tslint:disable-line no-console
            return null;
        }

        return $get(['properties', propertyName, 'ui', 'inline', 'editor'], nodeType) || this._defaultInlineEditor;
    }

    /**
     * Inline Editor Configuration looks as follows:
     *
     * formatting: // what formatting is enabled / disabled
     *   strong: true
     *   a: true
     *   MyFormattingRule: {Configuration Object if needed}
     * placeholder: "Placeholder text"
     * autoparagraph: true/false
     */
    public getInlineEditorOptionsForProperty(nodeTypeName: NodeTypeName, propertyName: string): {[propName: string]: any} | null {
        const nodeType = this.get(nodeTypeName);

        const defautlInlineEditorOptions = {
            formatting: {},
            placeholder: '',
            autoparagraph: false
        };

        if (!nodeType) {
            console.error('Nodetype not found', nodeTypeName); // tslint:disable-line no-console
            return null;
        }

        const inlineEditorOptions = $get(['properties', propertyName, 'ui', 'inline', 'editorOptions'], nodeType) || {};

        return merge(defautlInlineEditorOptions, inlineEditorOptions);
    }

    public isInlineEditable(nodeTypeName: NodeTypeName): boolean {
        const nodeType = this.get(nodeTypeName);

        if (!nodeType) {
            console.error('Nodetype not found', nodeTypeName); // tslint:disable-line no-console
            return false;
        }

        if ($get(['ui', 'inlineEditable'], nodeType)) {
            return true;
        }

        const propertyDefinitions = $get(['properties'], nodeType);

        if (!propertyDefinitions) {
            return false;
        }

        return Object.keys(propertyDefinitions).some(
            propertyName => $get([propertyName, 'ui', 'inlineEditable'], propertyDefinitions) || false
        );
    }
}
