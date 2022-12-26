import {createSelector, defaultMemoize} from 'reselect';
import {GlobalState} from '../../System';
import {NodeContextPath, NodeMap, Node, NodeTypeName, ClipboardMode, NodeTypesRegistry} from '@neos-project/neos-ts-interfaces';

export const inlineValidationErrorsSelector = (state: GlobalState) => state?.cr?.nodes?.inlineValidationErrors;
export const nodesByContextPathSelector = (state: GlobalState) => state?.cr?.nodes?.byContextPath;
export const siteNodeContextPathSelector = (state: GlobalState) => state?.cr?.nodes?.siteNode;
export const documentNodeContextPathSelector = (state: GlobalState) => state?.cr?.nodes?.documentNode;
export const focusedNodePathsSelector = (state: GlobalState) => state?.cr?.nodes?.focused?.contextPaths;

// This is internal, as in most cases you want `focusedNodePathSelector`, which is able to fallback to documentNode, when no node is focused
export const _focusedNodeContextPathSelector = createSelector(
    [
        focusedNodePathsSelector
    ],
    focusedNodePaths => {
        return focusedNodePaths && focusedNodePaths[0] ? focusedNodePaths[0] : null;
    }
);
export const isDocumentNodeSelectedSelector = createSelector(
    [
        _focusedNodeContextPathSelector,
        documentNodeContextPathSelector
    ],
    (focused, currentContentCanvasContextPath) => {
        return !focused || (focused === currentContentCanvasContextPath);
    }
);

export const hasFocusedContentNode = createSelector(
    [
        _focusedNodeContextPathSelector,
        documentNodeContextPathSelector
    ],
    (focused, currentContentCanvasContextPath) => {
        return Boolean(focused && (focused !== currentContentCanvasContextPath));
    }
);

export const nodeByContextPath = (state: GlobalState) => (contextPath: NodeContextPath) =>
    state?.cr?.nodes?.byContextPath?.[contextPath];

export const makeGetDocumentNodes = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        nodesByContextPathSelector
    ],
    nodesMap => {
        const documentRole = nodeTypesRegistry.getRole('document');
        if (!documentRole) {
            throw new Error('Document role is not loaded!');
        }
        const documentSubNodeTypes = nodeTypesRegistry.getSubTypesOf(documentRole);

        const result: NodeMap = {};
        Object.keys(nodesMap).forEach(contextPath => {
            const node = nodesMap[contextPath];
            if (!node) {
                throw new Error('This error should never be thrown, it\'s a way to fool TypeScript');
            }
            if (documentSubNodeTypes.includes(node.nodeType)) {
                result[contextPath] = node;
            }
        });
        return result;
    }
);

export const makeGetNodeByContextPathSelector = (contextPath: NodeContextPath) => createSelector(
    [
        (state: GlobalState) => state?.cr?.nodes?.byContextPath?.[contextPath]
    ],
    node => node
);

export const makeHasChildrenSelector = (allowedNodeTypes: NodeTypeName[]) => createSelector(
    [
        (state: GlobalState, contextPath: NodeContextPath) => state?.cr?.nodes?.byContextPath?.[contextPath]
    ],
    node => (node && node.children || []).some(
        childNodeEnvelope => childNodeEnvelope ? allowedNodeTypes.includes(childNodeEnvelope.nodeType) : false
    )
);

export const makeChildrenOfSelector = (allowedNodeTypes: NodeTypeName[]) => createSelector(
    [
        (state: GlobalState, contextPath: NodeContextPath) => state?.cr?.nodes?.byContextPath?.[contextPath],
        nodesByContextPathSelector
    ],
    (node, nodesByContextPath: NodeMap) => (node && node.children || [])
        .filter(
            childNodeEnvelope => {
                return childNodeEnvelope !== null || childNodeEnvelope !== undefined;
            }
        )
        .filter(
            childNodeEnvelope => {
                const nodeType = childNodeEnvelope ? childNodeEnvelope.nodeType : '';
                return allowedNodeTypes.includes(nodeType) || nodeType === 'Neos.Neos:FallbackNode';
            }
        ).map(
            childNodeEnvelope => {
                return nodesByContextPath[childNodeEnvelope.contextPath];
            }
        )
);

export const siteNodeSelector = createSelector(
    [
        siteNodeContextPathSelector,
        nodesByContextPathSelector
    ],
    (siteNodeContextPath, nodesByContextPath) => {
        if (siteNodeContextPath) {
            return nodesByContextPath[siteNodeContextPath] || null;
        }
        return null;
    }
);

export const documentNodeSelector = createSelector(
    [
        documentNodeContextPathSelector,
        nodesByContextPathSelector
    ],
    (documentNodeContextPath, nodesByContextPath) => {
        if (documentNodeContextPath) {
            return nodesByContextPath[documentNodeContextPath] || null;
        }
        return null;
    }
);

export const byContextPathSelector = defaultMemoize(
    (contextPath: NodeContextPath) => createSelector(
        [
            nodeByContextPath
        ],
        getNodeByContextPath => getNodeByContextPath(contextPath)
    )
);

export const parentNodeSelector = (state: GlobalState) => (baseNode: Node) => {
    if (baseNode.parent !== null) {
        return byContextPathSelector(baseNode.parent)(state);
    }
    return null;
};

export const grandParentNodeSelector = (state: GlobalState) => (baseNode: Node) => {
    if (baseNode.parent !== null) {
        const parentNode = byContextPathSelector(baseNode.parent)(state);
        if (parentNode && parentNode.parent) {
            return byContextPathSelector(parentNode.parent)(state);
        }
    }
    return null;
};

export const focusedNodePathSelector = createSelector(
    [
        _focusedNodeContextPathSelector,
        documentNodeContextPathSelector
    ],
    (focused, currentContentCanvasContextPath) => {
        return focused || currentContentCanvasContextPath;
    }
);

export const focusedSelector = createSelector(
    [
        focusedNodePathSelector,
        nodeByContextPath
    ],
    (focusedNodePath, getNodeByContextPath) => {
        if (focusedNodePath !== null) {
            return getNodeByContextPath(focusedNodePath) || null;
        }
        return null;
    }
);

export const focusedNodeTypeSelector = createSelector(
    [
        focusedSelector
    ],
    focused => focused && focused.nodeType
);

export const focusedNodeIdentifierSelector = createSelector(
    [
        focusedSelector
    ],
    focused => focused && focused.identifier
);

export const focusedParentSelector = createSelector(
    [
        focusedSelector,
        state => state
    ],
    (focusedNode, state) => {
        if (!focusedNode) {
            return null;
        }

        return parentNodeSelector(state)(focusedNode);
    }
);

export const focusedGrandParentSelector = createSelector(
    [
        focusedParentSelector,
        state => state
    ],
    (focusedParentNode, state) => {
        if (!focusedParentNode) {
            return null;
        }

        return parentNodeSelector(state)(focusedParentNode);
    }
);

export const clipboardNodesContextPathsSelector = (state: GlobalState) => state?.cr?.nodes?.clipboard;

export const clipboardNodeContextPathSelector = createSelector(
    [
        clipboardNodesContextPathsSelector
    ],
    clipboardNodesContextPaths => Boolean(console.warn('This selector is deprecated, use "clipboardNodesContextPathsSelector" instead')) || (clipboardNodesContextPaths && clipboardNodesContextPaths[0])
);

export const clipboardIsEmptySelector = createSelector(
    [
        clipboardNodeContextPathSelector
    ],
    clipboardNodePath => Boolean(clipboardNodePath)
);

/**
 * @TODO: Remove getPathInNode in version 10
 * @deprecated getPathInNode will be removed in version 10. In the meantime
 *             please consider retrieving the node at `contextPath` via
 *             `selectors.CR.Nodes.byContextPathSelector` and accessing the
 *             property at `propertyPath` manually.
 */
export const getPathInNode = (state: GlobalState, contextPath: NodeContextPath, propertyPath: any) => {
    console.warn(
        'Neos UI Deprecation Warning: `selectors.CR.Nodes.getPathInNode` is' +
            ' deprecated and will be removed in version 10. In the meantime' +
            ' please consider retrieving the node at `contextPath` via' +
            ' `selectors.CR.Nodes.byContextPathSelector` and accessing the' +
            ' property at `propertyPath` manually.',
        {contextPath, propertyPath}
    );

    const node = state?.cr?.nodes?.byContextPath?.[contextPath];

    let resolvedPropertyPath: Array<string | number>;
    switch (true) {
        case Array.isArray(propertyPath):
            resolvedPropertyPath = propertyPath as Array<string | number>;
            break;
        case typeof propertyPath === 'number':
            resolvedPropertyPath = [propertyPath as number];
            break;
        case typeof propertyPath === 'string':
            resolvedPropertyPath = (propertyPath as string)
                .split('.')
                .map(part => {
                    const partAsInteger = parseInt(part, 10);

                    if (
                        !isNaN(partAsInteger) &&
                        String(partAsInteger) === part
                    ) {
                        return partAsInteger;
                    }

                    return part;
                });
            break;
        default:
            // As per plow-js:
            // > This function returns the path, if it is neither
            // > an array nor a string nor a number
            //
            // @see: https://codeberg.org/wbehncke/plow-js/src/commit/d82eb78234f2c47158d6541f98282e3464a240ac/src/projections/atoms/get/index.js#L9-L15
            return propertyPath;
    }

    return resolvedPropertyPath.reduce((subject, part) => {
        return subject && (subject as any)[part];
    }, node);
};

export const makeGetAllowedChildNodeTypesSelector = (nodeTypesRegistry: NodeTypesRegistry, elevator: (id: string, state: GlobalState) => string | null = id => id) => createSelector(
    [
        (state: GlobalState, {reference}: {reference: NodeContextPath | null, role: string}) => {
            if (reference === null) {
                return null;
            }
            const elevatedReference = elevator(reference, state);
            if (elevatedReference) {
                return state?.cr?.nodes?.byContextPath[elevatedReference] || null;
            }
            return null;
        },
        (state: GlobalState, {reference}: {reference: NodeContextPath | null, role: string}) => {
            if (reference === null) {
                return null;
            }
            const parentReference =
                state?.cr?.nodes?.byContextPath[reference]?.parent ?? null;
            if (parentReference !== null) {
                const elevatedReferenceParent = elevator(parentReference, state);
                if (elevatedReferenceParent !== null) {
                    return state?.cr?.nodes?.byContextPath?.[elevatedReferenceParent] || null;
                }
            }
            return null;
        },
        (_: GlobalState, {role}: {reference: NodeContextPath | null, role: string, subject: NodeContextPath | null}) => role
    ],
    (referenceNode, referenceParentNode, role) => {
        if (referenceNode === null || (referenceNode.policy && referenceNode.policy.canEdit === false)) {
            return [];
        }
        const isSubjectNodeAutocreated = referenceNode.isAutoCreated;
        const referenceParentName = referenceNode.name;
        const referenceParentNodeType = referenceNode.nodeType;
        const referenceGrandParentNodeType = referenceParentNode ? referenceParentNode.nodeType : null;
        return nodeTypesRegistry
            .getAllowedNodeTypesTakingAutoCreatedIntoAccount(isSubjectNodeAutocreated, referenceParentName, referenceParentNodeType, referenceGrandParentNodeType, role)
            .filter(nodeType => !(referenceNode.policy && referenceNode.policy.disallowedNodeTypes.includes(nodeType)));
    }
);

export const makeGetAllowedSiblingNodeTypesSelector = (nodeTypesRegistry: NodeTypesRegistry) =>
    makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry, (nodeContextPath, state) => state?.cr?.nodes?.byContextPath[nodeContextPath]?.parent ?? null);

export const makeIsAllowedToAddChildOrSiblingNodes = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry),
        makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry)
    ],
    (allowedChildNodeTypes, allowedSiblingNodeTypes) =>
        Boolean(allowedChildNodeTypes.length + allowedSiblingNodeTypes.length)
);

export const makeCanBeCopiedAlongsideSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        (state: GlobalState, {subject}: {subject: NodeContextPath | null}) => subject ? state?.cr?.nodes?.byContextPath?.[subject] : false,
        makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry)
    ],
    (subjectNode, allowedNodeTypes) => subjectNode ? allowedNodeTypes.includes(subjectNode.nodeType) : false
);

export const makeCanBeCopiedIntoSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        (state: GlobalState, {subject}: {subject: NodeContextPath | null}) => subject ? state?.cr?.nodes?.byContextPath?.[subject] : false,
        makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry)
    ],
    (subjectNode, allowedNodeTypes) => subjectNode ? allowedNodeTypes.includes(subjectNode.nodeType) : false
);

export const makeCanBeMovedIntoSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        makeCanBeCopiedIntoSelector(nodeTypesRegistry),
        (_, {subject, reference}: {subject: NodeContextPath | null, reference: NodeContextPath | null}) => {
            const subjectPath = subject && subject.split('@')[0];
            return subjectPath && reference ? reference.indexOf(subjectPath) === 0 : false;
        }
    ],
    (canBeInsertedInto, referenceIsDescendantOfSubject) => canBeInsertedInto && !referenceIsDescendantOfSubject
);

export const makeCanBeMovedAlongsideSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        makeCanBeCopiedAlongsideSelector(nodeTypesRegistry),
        (state: GlobalState, {subject, reference}) => {
            if (reference === null) {
                return false;
            }
            const subjectPath = subject && subject.split('@')[0];
            const referenceParent =
                state?.cr?.nodes?.byContextPath[reference]?.parent ?? null;
            if (!referenceParent) {
                return false;
            }
            return subjectPath ? referenceParent.indexOf(subjectPath) === 0 : false;
        }
    ],
    (canBeInsertedInto, referenceIsDescendantOfSubject) => canBeInsertedInto && !referenceIsDescendantOfSubject
);

export const makeCanBeCopiedSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        makeCanBeCopiedAlongsideSelector(nodeTypesRegistry),
        makeCanBeCopiedIntoSelector(nodeTypesRegistry)
    ],
    (canBeInsertedAlongside, canBeInsertedInto) => (canBeInsertedAlongside || canBeInsertedInto)
);

export const makeCanBeMovedSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        makeCanBeMovedAlongsideSelector(nodeTypesRegistry),
        makeCanBeMovedIntoSelector(nodeTypesRegistry)
    ],
    (canBeMovedAlongside, canBeMovedInto) => (canBeMovedAlongside || canBeMovedInto)
);

export const makeCanBePastedSelector = (nodeTypesRegistry: NodeTypesRegistry) => createSelector(
    [
        makeCanBeMovedSelector(nodeTypesRegistry),
        makeCanBeCopiedSelector(nodeTypesRegistry),
        (state: GlobalState) => state?.cr?.nodes?.clipboardMode
    ],
    (canBeMoved, canBeCopied, mode) => mode === ClipboardMode.COPY ? canBeCopied : canBeMoved
);

export const destructiveOperationsAreDisabledSelector = createSelector(
    [
        siteNodeContextPathSelector,
        _focusedNodeContextPathSelector,
        focusedSelector
    ],
    (siteNodeContextPath, focusedNodeContextPath, focusedNode) => {
        return (
            focusedNode === null ||
            focusedNode.isAutoCreated ||
            siteNodeContextPath === focusedNodeContextPath
        );
    }
);

export const destructiveOperationsAreDisabledForContentTreeSelector = createSelector(
    [
        siteNodeContextPathSelector,
        focusedNodePathsSelector,
        nodesByContextPathSelector
    ],
    (siteNodeContextPath, focusedNodesContextPaths, nodesByContextPath) => {
        return focusedNodesContextPaths.map(contextPath => {
            const node = nodesByContextPath[contextPath];
            return node && node.isAutoCreated || siteNodeContextPath === contextPath;
        }).filter(Boolean).length > 0;
    }
);

export const focusedNodeParentLineSelector = createSelector(
    [
        focusedSelector,
        nodesByContextPathSelector
    ],
    (focusedNode, nodesByContextPath) => {
        const result = [focusedNode];
        let currentNode = focusedNode;

        while (currentNode) {
            const {parent} = currentNode;
            if (parent) {
                currentNode = nodesByContextPath[parent] || null;
                if (currentNode) {
                    result.push(currentNode);
                }
            } else {
                break;
            }
        }

        return result;
    }
);
