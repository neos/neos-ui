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
import {InsertPosition} from '@neos-project/neos-ts-interfaces';
import {Node} from '@neos-project/neos-ui-contentrepository-model';
import {NodeTypesRegistry} from '@neos-project/neos-ui-contentrepository';
import {I18nRegistry} from '@neos-project/neos-ui-i18n';

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
            insertPosition,
            className: style.toolBar__btnGroup__btn
        };
    }, [i18nRegistry, contextPath, fusionPath, destructiveOperationsAreDisabled, canBeDeleted, canBeEdited, isCopied, isCut, visibilityCanBeToggled, insertPosition]);

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
            <StructuralToolbar insertPosition={insertPosition} buttonProps={toolbarButtonProps}/>
        </>
    ) : (
        <div
            className={style.toolBar__anchor}
            id="inline-ui-node-anchor"
            style={anchorPosition}
        >
            <ContextToolbar buttonProps={toolbarButtonProps} fusionPath={fusionPath}/>
            <StructuralToolbar insertPosition={insertPosition} buttonProps={toolbarButtonProps}/>
        </div>
    );
};

export default React.memo(withNeosGlobals(NodeToolbar as any));
