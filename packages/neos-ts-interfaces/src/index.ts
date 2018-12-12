export type NodeContextPath = string;
export type NodeTypeName = string;

export interface NodeChild {
    contextPath: NodeContextPath;
    nodeType: NodeTypeName;
}
// TODO: for some reason (probably due to immer) I can not use ReadonlyArray here
export interface NodeChildren extends ReadonlyArray<NodeChild> {}

export interface NodePolicy extends Readonly<{
    disallowedNodeTypes: NodeTypeName[];
    canRemove: boolean;
    canEdit: boolean;
    disallowedProperties: string[];
}> {}

// TODO: for some reason (probably due to immer) I can not use Readonly here
export interface Node {
    contextPath: NodeContextPath;
    name: string;
    identifier: string;
    nodeType: NodeTypeName;
    label: string;
    isAutoCreated: boolean;
    depth: number;
    children: NodeChildren;
    matchesCurrentDimensions: boolean;
    properties: {
        [propName: string]: any;
    };
    isFullyLoaded: boolean;
    uri: string;
    policy?: NodePolicy;
}

export interface NodeMap {
    [propName: string]: Node;
}

export enum ClipboardMode {
    COPY = 'Copy',
    MOVE = 'Move'
}

export enum InsertPosition {
    INTO = 'into',
    BEFORE = 'before',
    AFTER = 'after'
}

export interface NodeType {
    superTypes: {
        [propName: string]: boolean;
    };
    constraints: {
        nodeTypes: {
            [propName: string]: boolean;
        }
    };
    label?: string;
    ui?: {
        group?: string;
        icon?: string;
        label?: string;
        position?: number | string;
        inspector?: {
            groups?: {
                [propName: string]: {
                    title?: string;
                    label?: string;
                    icon?: string;
                    tab?: string;
                    position?: number | string;
                    collapsed?: boolean;
                }
            };
            tabs?: {
                [propName: string]: {
                    label?: string;
                    position?: number | string;
                    icon?: string;
                };
            };
            views?: {
                group?: string;
                label?: string;
                view?: string;
                viewOptions?: {
                    [propName: string]: any;
                };
            };
        };
        creationDialog?: {
            elements?: {
                [propName: string]: {
                    type?: string;
                    ui?: {
                        label?: string;
                        editor?: string;
                        editorOptions?: {
                            [propName: string]: any;
                        };
                    };
                    validation?: {
                        [propName: string]: {
                            [propName: string]: any;
                        };
                    };
                };
            };
        };
    };
    properties?: {
        type?: string;
        ui?: {
            label?: string;
            reloadIfChanged?: boolean;
            inspector?: {
                defaultValue?: string;
                editor?: string;
                editorOptions?: {
                    [propName: string]: any;
                }
                group?: string;
                position?: number | string;
            };
        };
        validation?: {
            [propName: string]: {
                [propName: string]: any;
            }
        };
    };
}

// TODO: move to nodetypesregistry itself
export interface NodeTypesRegistry {
    getRole: (roleName: string) => NodeTypeName;
    getSubTypesOf: (nodeType: NodeTypeName) => NodeTypeName[];
    getAllowedNodeTypesTakingAutoCreatedIntoAccount: (isSubjectNodeAutocreated: boolean, referenceParentName: string, referenceParentNodeType: NodeTypeName, referenceGrandParentNodeType: NodeTypeName | null, role: string) => NodeTypeName[];
}
