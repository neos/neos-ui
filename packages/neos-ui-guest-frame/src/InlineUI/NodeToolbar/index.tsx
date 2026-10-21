import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    animateScrollToElementInGuestFrame,
    findNodeInGuestFrame,
    getAbsolutePositionOfElementInGuestFrame,
    getGuestFrameWindow,
    isElementVisibleInGuestFrame
// @ts-ignore
} from '@neos-project/neos-ui-guest-frame/src/dom';
import {neos} from '@neos-project/neos-ui-decorators';
import {InsertPosition, Node} from '@neos-project/neos-ts-interfaces';
import {NodeTypesRegistry} from '@neos-project/neos-ui-contentrepository';
import {I18nRegistry} from '@neos-project/neos-ui-i18n';
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';

import StructuralToolbar from './StructuralToolbar';
import ContextToolbar from './ContextToolbar';

import style from './style.module.css';

type InjectedNodeToolbarProps = {
    nodeTypesRegistry: NodeTypesRegistry;
    // We still need the i18n registry here to pass it down to the buttons
    i18nRegistry: I18nRegistry;
}

const supportsCSSAnchors = 'anchorName' in document.documentElement.style;

const withNeosGlobals = neos<NodeToolbarProps, InjectedNodeToolbarProps>((globalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}));

type NodeToolbarProps = {
    canBeDeleted: boolean;
    canBeEdited: boolean;
    destructiveOperationsAreDisabled: boolean;
    focusedNode?: Node;
    fusionPath?: string;
    isCopied: boolean;
    isCut: boolean;
    requestScrollIntoView: (value: boolean) => void;
    shouldScrollIntoView: boolean;
    visibilityCanBeToggled: boolean;
    visible?: boolean;
}

const NodeToolbar: React.FC<NodeToolbarProps & InjectedNodeToolbarProps> = ({
    canBeDeleted,
    canBeEdited,
    destructiveOperationsAreDisabled,
    focusedNode,
    fusionPath,
    i18nRegistry,
    isCopied,
    isCut,
    nodeTypesRegistry,
    requestScrollIntoView,
    shouldScrollIntoView,
    visibilityCanBeToggled,
    visible
}) => {
    const [insertPosition, setInsertPosition] = useState<InsertPosition>(InsertPosition.AFTER);
    const [anchorPosition, setAnchorPosition] = useState<{top: number, left: number, height: number, right: number, width: number}|null>(null);

    const iframeWindow = useRef(getGuestFrameWindow()).current;

    const contextPath = focusedNode?.contextPath;

    const isContentCollection = useMemo(() => {
        return focusedNode ? nodeTypesRegistry.hasRole(focusedNode.nodeType, 'contentCollection') : false
    }, [focusedNode, nodeTypesRegistry]);

    // Check whether inserting nodes alongside (before/after) or into the focused node is
    // allowed, so that structurally disallowed insert positions are not offered at all
    const allowedSiblingNodeTypesSelector = useMemo(
        () => selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry),
        [nodeTypesRegistry]
    );
    const allowedChildNodeTypesSelector = useMemo(
        () => selectors.CR.Nodes.makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry),
        [nodeTypesRegistry]
    );

    const role = focusedNode
        ? (nodeTypesRegistry.hasRole(focusedNode.nodeType, 'document') ? 'document' : 'content')
        : 'content';

    const canInsertAlongside = useSelector(state =>
        allowedSiblingNodeTypesSelector(state, {reference: contextPath ?? null, subject: null, role}).length > 0
    );
    const canInsertInto = useSelector(state =>
        allowedChildNodeTypesSelector(state, {reference: contextPath ?? null, subject: null, role}).length > 0
    );

    // An empty content collection has no meaningful "alongside" positions - a new node can
    // only be inserted into it, so the toolbar always shows in the center "into" position
    const isEmptyCollection = isContentCollection
        && Boolean(focusedNode?.isFullyLoaded)
        && (focusedNode?.children?.length ?? 0) === 0;

    // If inserting alongside is not allowed, but inserting into is (e.g., for auto-created
    // content collections like the columns of a multi-column element), then "into" is the
    // only valid insertion and is performed no matter which of the three hover zones the
    // toolbar is shown in - the toolbar placement itself still follows the cursor position
    const effectiveInsertPosition = !canInsertAlongside && canInsertInto
        ? InsertPosition.INTO
        : insertPosition;

    // An empty content collection is pinned to the center "into" position - but only as long
    // as inserting alongside it is disallowed. If siblings may be added, the above/below
    // positions are offered again so that content can be placed before and after the element
    const toolbarPlacement = isEmptyCollection && !canInsertAlongside
        ? InsertPosition.INTO
        : insertPosition;

    // When the toolbar is shown in the top hover zone, but only "into" insertion is allowed
    // (e.g., for auto-created content collections), a node can still be placed at the very
    // top by inserting it before the first child node instead of at the end
    const creationReference = useSelector(state => {
        if (effectiveInsertPosition === InsertPosition.INTO && insertPosition === InsertPosition.BEFORE) {
            for (const child of focusedNode?.children ?? []) {
                if (child && state?.cr?.nodes?.byContextPath?.[child.contextPath]) {
                    return {contextPath: child.contextPath, fusionPath: undefined};
                }
            }
        }
        return null;
    });
    const creationInsertPosition = creationReference ? InsertPosition.BEFORE : effectiveInsertPosition;

    // Whether an "into" insertion will land below existing content (i.e. it is appended
    // after the last child, as opposed to being placed before the first one via a
    // creation reference, or into an empty collection) - used by the buttons to hint
    // at the resulting relative position
    const insertsBelowExistingContent = effectiveInsertPosition === InsertPosition.INTO
        && !creationReference
        && !isEmptyCollection;

    const nodeElement = useMemo(() => findNodeInGuestFrame(contextPath, fusionPath), [contextPath, fusionPath]);

    // Track mouse position for toolbar positioning
    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (!focusedNode || !anchorPosition) {
            setInsertPosition(InsertPosition.AFTER);
            return;
        }

        // Round offset to the closest divisible value to avoid too many state updates
        const cursorOffsetY = Math.round(event.pageY / 10) * 10;
        const activeRange = Math.max(Math.round(anchorPosition.height / 5), 20);

        if (isContentCollection && cursorOffsetY >= (anchorPosition.top + activeRange) && cursorOffsetY <= (anchorPosition.top + anchorPosition.height - activeRange)) {
            setInsertPosition(InsertPosition.INTO);
        } else if (cursorOffsetY >= anchorPosition.top + anchorPosition.height - activeRange) {
            setInsertPosition(InsertPosition.AFTER);
        } else if (cursorOffsetY <= anchorPosition.top + activeRange) {
            setInsertPosition(InsertPosition.BEFORE);
        }
    }, [focusedNode, anchorPosition, nodeTypesRegistry, isContentCollection]);

    const updateAnchorPosition = useCallback(() => {
        if (!visible) {
            return;
        }

        const newAnchorPosition = getAbsolutePositionOfElementInGuestFrame(nodeElement);
        setAnchorPosition(prevAnchorPosition => {
            if (prevAnchorPosition
                && prevAnchorPosition.top === newAnchorPosition.top
                && prevAnchorPosition.left === newAnchorPosition.left
                && prevAnchorPosition.width === newAnchorPosition.width
                && prevAnchorPosition.height === newAnchorPosition.height) {
                return prevAnchorPosition;
            }
            return newAnchorPosition;
        });
    }, [nodeElement, visible]);

    const scrollIntoView = useCallback(() => {
        // Only scroll into view when triggered from content tree (on focus change)
        if (shouldScrollIntoView) {
            if (nodeElement && !isElementVisibleInGuestFrame(nodeElement)) {
                animateScrollToElementInGuestFrame(nodeElement, 100);
            }
            requestScrollIntoView(false);
        }
    }, [shouldScrollIntoView, nodeElement, requestScrollIntoView]);

    const toolbarButtonProps = useMemo(() => {
        return {
            i18nRegistry,
            contextPath,
            fusionPath,
            destructiveOperationsAreDisabled,
            canBeDeleted,
            canBeEdited,
            isCopied,
            isCut,
            visibilityCanBeToggled,
            insertPosition: effectiveInsertPosition,
            creationReference,
            creationInsertPosition,
            insertsBelowExistingContent,
            className: style.toolBar__btnGroup__btn
        };
    }, [i18nRegistry, contextPath, fusionPath, destructiveOperationsAreDisabled, canBeDeleted, canBeEdited, isCopied, isCut, visibilityCanBeToggled, effectiveInsertPosition, creationReference, creationInsertPosition, insertsBelowExistingContent]);

    useEffect(() => {
        if (!iframeWindow) {
            return;
        }

        iframeWindow.addEventListener('mousemove', handleMouseMove);

        // With the observer we can immediately react to size changes during inline editing
        const resizeObserver = new ResizeObserver(updateAnchorPosition);
        if (nodeElement) {
            resizeObserver.observe(nodeElement);
            resizeObserver.observe(getGuestFrameWindow().document.body);
        }

        scrollIntoView();
        updateAnchorPosition();

        return () => {
            resizeObserver.disconnect();
            iframeWindow.removeEventListener('mousemove', handleMouseMove);
        };
    }, [nodeElement, handleMouseMove, scrollIntoView, updateAnchorPosition]);

    // Update effect - equivalent to componentDidUpdate
    useEffect(() => {
        scrollIntoView();
        updateAnchorPosition();
    }, [scrollIntoView, updateAnchorPosition]);

    if (!nodeElement || !visible || !anchorPosition) {
        return null;
    }

    // The anchor positioning fallback requires both toolbars to be wrapped inside the anchor element. CSS anchors require them to be separate.
    return supportsCSSAnchors ? (
        <>
            <div
                className={style.toolBar__anchor}
                id="inline-ui-node-anchor"
                style={anchorPosition}
            >
            </div>
            <ContextToolbar buttonProps={toolbarButtonProps} fusionPath={fusionPath}/>
            <StructuralToolbar insertPosition={toolbarPlacement} buttonProps={toolbarButtonProps}/>
        </>
    ) : (
        <div
            className={style.toolBar__anchor}
            id="inline-ui-node-anchor"
            style={anchorPosition}
        >
            <ContextToolbar buttonProps={toolbarButtonProps} fusionPath={fusionPath}/>
            <StructuralToolbar insertPosition={toolbarPlacement} buttonProps={toolbarButtonProps}/>
        </div>
    );
};

export default React.memo(withNeosGlobals(NodeToolbar as any));
