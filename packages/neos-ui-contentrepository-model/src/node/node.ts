import {DimensionPresetCombination} from '../dimension';

// FIXME, these aliases are not good practice.
// Its still allowed to pass strings around and no type safety is gained and the IDE will not show the name of the type when checking a field but just the resolved primitive.
// Instead we should use ValueObjects (ES6 Classes) or decide for a typescript "hack" to attach a unique Symbol to the type like: string & { readonly __id: unique symbol };
export type NodeContextPath = string;
export type NodeTypeName = string;

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
