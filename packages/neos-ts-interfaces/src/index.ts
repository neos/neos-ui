/**
 * @deprecated PLEASE DON'T ADD NEW THINGS HERE
 * Rather extract types to well structures subpackages.
 * The types belong to the source files directly.
 */

import {PropertyScope} from '@neos-project/neos-ui-contentrepository-model';

// FIXME, these aliases are not good practice.
// Its still allowed to pass strings around and no type safety is gained and the IDE will not show the name of the type when checking a field but just the resolved primitive.
// Instead we should use ValueObjects (ES6 Classes) or decide for a typescript "hack" to attach a unique Symbol to the type like: string & { readonly __id: unique symbol };
export type NodeContextPath = string;
export type FusionPath = string;
export type NodeTypeName = string;
export type WorkspaceName = string;

export type DimensionName = string;
export type DimensionValue = string;
export type DimensionPresetName = string;

export type DimensionValues = DimensionValue[];

export interface Workspace {
    name: WorkspaceName;
    title: string;
    readonly: boolean;
}

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
    role: 'document' | 'content';
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

export enum WorkspaceStatus {
    UP_TO_DATE = 'UP_TO_DATE',
    OUTDATED = 'OUTDATED'
}

export interface ValidatorConfiguration {
    [propName: string]: any;
}

export interface PropertyConfiguration {
    type?: string;
    scope?: PropertyScope;
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
export interface ReferencesConfiguration {
    type?: string;
    scope?: PropertyScope;
    ui?: {
        label?: string;
        reloadIfChanged?: boolean;
        inspector?: {
            hidden?: boolean;
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
                        hidden?: boolean | string;
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
    references?: {
        [referenceName: string]: ReferencesConfiguration | undefined;
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
