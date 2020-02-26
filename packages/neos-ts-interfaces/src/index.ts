export type NodeContextPath = string;
export type FusionPath = string;
export type NodeTypeName = string;
export type WorkspaceName = string;

export type DimensionName = string;
export type DimensionValue = string;
export type DimensionPresetName = string;

export type DimensionValues = DimensionValue[];

export interface DimensionCombination {
    [propName: string]: DimensionValues;
}


export interface DimensionPresetCombination {
    [propName: string]: DimensionPresetName;
}

export interface PresetConfiguration {
    name?: string;
    label: string;
    values: DimensionValues;
    uriSegment: string;
}

export interface DimensionInformation {
    default: string;
    defaultPreset: string;
    label: string;
    icon: string;
    presets: {
        [propName: string]: PresetConfiguration;
    };
}

export interface ContextProperties {
    contextPath?: NodeContextPath;
    workspaceName?: WorkspaceName;
    invisibleContentShown?: boolean;
    removedContentShown?: boolean;
}

export interface NodeChild {
    contextPath: NodeContextPath;
    nodeType: NodeTypeName;
}
// TODO: for some reason (probably due to immer) I can not use ReadonlyArray here
export interface NodeChildren extends Array<NodeChild> {}

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
    parent: NodeContextPath;
    policy?: NodePolicy;
    dimensions?: DimensionPresetCombination;
    otherNodeVariants?: DimensionPresetCombination[];
}

// Type guard using duck-typing on some random properties to know if object is a Node
export const isNode = (node: any): node is Node => Boolean(typeof node === 'object' && node.contextPath);

export interface NodeMap {
    [propName: string]: Node | undefined;
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

export enum SelectionModeTypes {
    SINGLE_SELECT = 'SINGLE_SELECT',
    MULTIPLE_SELECT = 'MULTIPLE_SELECT',
    RANGE_SELECT = 'RANGE_SELECT'
}

export interface ValidatorConfiguration {
    [propName: string]: any;
}

export interface PropertyConfiguration {
    type?: string;
    ui?: {
        label?: string;
        reloadIfChanged?: boolean;
        inline?: {
            editor?: string;
            editorOptions?: {
                [propName: string]: any;
            };
        }
        inlineEditable?: boolean;
        inspector?: {
            hidden?: boolean;
            defaultValue?: string;
            editor?: string;
            editorOptions?: {
                [propName: string]: any;
            }
            group?: string;
            position?: number | string;
        };
        help?: {
            message?: string;
            thumbnail?: string;
        };
        aloha?: any; // deprecated format
    };
    validation?: {
        [propName: string]: ValidatorConfiguration | undefined;
    };
}

export interface NodeType {
    name?: string;
    superTypes: {
        [propName: string]: boolean | undefined;
    };
    constraints: {
        nodeTypes: {
            [propName: string]: boolean | undefined;
        }
    };
    label?: string;
    ui?: {
        group?: string;
        icon?: string;
        label?: string;
        position?: number | string;
        inlineEditable?: boolean;
        inspector?: {
            groups?: {
                [propName: string]: {
                    title?: string;
                    label?: string;
                    icon?: string;
                    tab?: string;
                    position?: number | string;
                    collapsed?: boolean;
                } | undefined;
            };
            tabs?: {
                [propName: string]: {
                    label?: string;
                    position?: number | string;
                    icon?: string;
                } | undefined;
            };
            views?: {
                [propName: string]: {
                    group?: string;
                    label?: string;
                    position?: number | string;
                    helpMessage?: string;
                    view?: string;
                    viewOptions?: {
                        [propName: string]: any;
                    };
                }
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
        [propName: string]: PropertyConfiguration | undefined;
    };
}

//
// Change object from our Changes API
//
export interface Change extends Readonly<{
    type: string;
    subject: NodeContextPath;
    payload: {
        propertyName: string;
        value: any;
    };
}> {}

// TODO: move to nodetypesregistry itself
export interface NodeTypesRegistry {
    get: (nodeType: NodeTypeName) => NodeType | null;
    getRole: (roleName: string) => NodeTypeName | null;
    getSubTypesOf: (nodeType: NodeTypeName) => NodeTypeName[];
    getAllowedNodeTypesTakingAutoCreatedIntoAccount: (isSubjectNodeAutocreated: boolean, referenceParentName: string, referenceParentNodeType: NodeTypeName, referenceGrandParentNodeType: NodeTypeName | null, role: string) => NodeTypeName[];
}

// TODO: move to validatorsregistry itself
type Validator = (
    values: {},
    elementConfigurations: any
) => null | {} | string;
export interface ValidatorRegistry {
    get: (validatorName: string) => Validator | null;
    set: (validatorName: string, validator: Validator) => void;
}
export interface I18nRegistry {
    translate: (id?: string, fallback?: string, params?: {}, packageKey?: string, sourceName?: string) => string;
}
export interface GlobalRegistry {
    get: <K extends string>(key: K) => K extends 'i18n' ? I18nRegistry :
        K extends 'validators' ? ValidatorRegistry : null;
}
