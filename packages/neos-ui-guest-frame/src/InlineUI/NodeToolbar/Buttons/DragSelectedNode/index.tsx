import React, {useCallback, useEffect} from 'react';
// @ts-ignore
import {connect} from 'react-redux';
import memoize from 'lodash.memoize';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n'
import {GlobalState} from "@neos-project/neos-ui-redux-store/src/System";
import {neos} from "@neos-project/neos-ui-decorators";
import {
    InsertPosition,
    Node,
    NodeContextPath,
    NodeTypeName,
    NodeTypesRegistry
} from "@neos-project/neos-ts-interfaces";
import {
    closestContextPathInGuestFrame,
    closestNodeInGuestFrame,
    findNodeInGuestFrame,
    getGuestFrameDocument
} from '@neos-project/neos-ui-guest-frame/src/dom';

import style from './style.module.css';

type DragSelectedNodeProps = {
    node: Node;
    className?: string;
    focusedFusionPath: string | null;
    destructiveOperationsAreDisabled: boolean;
    canBeEdited: boolean;
    getNodeByContextPath: (contextPath: NodeContextPath) => Node | null;
    moveNodes: (nodesToBeMoved: NodeContextPath[], targetNode: NodeContextPath, position: InsertPosition) => void;
    canBeInsertedAlongside: (draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => boolean;
    canBeInsertedInto: (draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => boolean;
    canBeDragged: (nodeTypeName: NodeTypeName) => boolean;
}

const DRAG_APPLICATION_ID = 'application/neos-ui';
const INDICATOR_OFFSET = 16; // Offset for the drop indicator element

const withReduxState = connect((state: GlobalState) => ({
    // TODO: Implement an actual selector to get the focused node's fusion path (not the only spot where we don't use selectors but the raw state in the UI)
    focusedFusionPath: state?.cr?.nodes?.focused?.fusionPath,
    node: selectors.CR.Nodes.focusedSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state),
}), {
    focusNode: actions.CR.Nodes.focus,
    moveNodes: actions.CR.Nodes.moveMultiple,
});

const withNeosGlobals = neos((globalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

const withDraggableContext = (component: React.FC) => withNeosGlobals(
    connect((_state: GlobalState, {nodeTypesRegistry}: { nodeTypesRegistry: NodeTypesRegistry }) => {
        const canBeMovedAlongsideSelector = selectors.CR.Nodes.makeCanBeMovedAlongsideSelector(nodeTypesRegistry);
        const canBeMovedIntoSelector = selectors.CR.Nodes.makeCanBeMovedIntoSelector(nodeTypesRegistry);

        return (
            state: GlobalState
        ) => {
            return {
                canBeInsertedAlongside: memoize((draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => canBeMovedAlongsideSelector(state, {
                    subject: draggedNodeContextPath,
                    reference: targetNodeContextPath,
                    role: 'content',
                })),
                canBeInsertedInto: memoize((draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => canBeMovedIntoSelector(state, {
                    subject: draggedNodeContextPath,
                    reference: targetNodeContextPath,
                    role: 'content',
                })),
                canBeDragged: memoize((nodeTypeName: NodeTypeName) => !nodeTypesRegistry.hasRole(nodeTypeName, 'document')),
            }
        }
    })(component));

const DragSelectedNode: React.FC<DragSelectedNodeProps> = ({
    className,
    node,
    focusedFusionPath,
    destructiveOperationsAreDisabled,
    getNodeByContextPath,
    canBeEdited,
    moveNodes,
    canBeInsertedAlongside,
    canBeInsertedInto,
    canBeDragged,
}) => {
    const dropIndicatorRef = React.useRef<HTMLDivElement>((() => {
        // FIXME: Use portal or other mechanism to have a single global arrow element or even have it in the host frame
        const guestFrameDocument = getGuestFrameDocument();
        let dropIndicatorElement = guestFrameDocument.getElementById('neos-inlineToolbar-dropIndicator');
        if (dropIndicatorElement) {
            return dropIndicatorElement;
        }
        dropIndicatorElement = document.createElement('div');
        dropIndicatorElement.id = 'neos-inlineToolbar-dropIndicator';
        dropIndicatorElement.className = style.nodeDropIndicator;
        const neosBackendContainer = guestFrameDocument.getElementById('neos-backend-container');
        neosBackendContainer.appendChild(dropIndicatorElement);
        return dropIndicatorElement;
    })());

    if (!node) {
        return null;
    }

    let nodeCanBeDragged = true;
    let title = translate('Neos.Neos.Ui:Main:dragSelectedNode', 'Drag selected node');

    switch (true) {
        case node.isAutoCreated:
            title = translate('Neos.Neos.Ui:Main:cannotMoveAutoCreatedNodes', 'Auto-created nodes cannot be moved');
            nodeCanBeDragged = false;
            break;
        case !canBeDragged(node.nodeType):
            title = translate('Neos.Neos.Ui:Main:cannotMoveNodesOfType', 'This type of node cannot be moved');
            nodeCanBeDragged = false;
            break;
    }

    const handleDragStart = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        if (!ev.dataTransfer) {
            return;
        }
        const nodeAddressInGuestFrame = {contextPath: node.contextPath, fusionPath: focusedFusionPath};
        ev.dataTransfer.setData(DRAG_APPLICATION_ID, JSON.stringify(nodeAddressInGuestFrame));
        ev.dataTransfer.effectAllowed = 'move';
    }, [node.contextPath, focusedFusionPath]);

    const handleDragOver = useCallback((ev: React.DragEvent<HTMLElement>) => {
        // Only handle the events which match our intent
        if (!ev.dataTransfer || !ev.dataTransfer.types.includes(DRAG_APPLICATION_ID)) {
            ev.dataTransfer.dropEffect = 'none';
            dropIndicatorRef.current.style.display = 'none';
            return;
        }
        ev.preventDefault();

        // Get the closest parent element to the currently hovered element which represents a node
        const closestNode = closestNodeInGuestFrame(ev.target) as HTMLElement;
        if (!closestNode) {
            ev.dataTransfer.dropEffect = 'none';
            dropIndicatorRef.current.style.display = 'none';
            return;
        }

        // Prevent dropping on the same node
        const closestContextPath = closestContextPathInGuestFrame(closestNode);
        const draggedNodeContextPath = node.contextPath;
        if (closestContextPath === draggedNodeContextPath) {
            ev.dataTransfer.dropEffect = "none";
            dropIndicatorRef.current.style.display = 'none';
            return;
        }

        // TODO: Optimise this by caching the closest node context path and only recalculating it when necessary

        // Calculate if the dragged node can be moved alongside or into the closest node
        const allowedAlongside = canBeInsertedAlongside(draggedNodeContextPath, closestContextPath);
        const allowedInside = canBeInsertedInto(draggedNodeContextPath, closestContextPath);

        // Position arrow based on allowed drop positions and offset from the closest node
        if (!allowedAlongside && !allowedInside) {
            ev.dataTransfer.dropEffect = "none";
            dropIndicatorRef.current.style.display = 'none';
            return;
        }

        // Get the Neos node to access properties for the indicator
        const neosNode = getNodeByContextPath(closestContextPath);

        // Calculate insert position based on the allowed positions and the mouse position
        const rect = closestNode.getBoundingClientRect();
        let indicatorOffsetTop = 0;
        let indicatorOffsetLeft = rect.left + INDICATOR_OFFSET;
        let indicatorHeight: string | number = 'auto';
        let indicatorLabel = '';
        if (allowedInside && !allowedAlongside) {
            // Position in the center of the node if dropping into it
            indicatorOffsetTop = rect.top + INDICATOR_OFFSET;
            indicatorHeight = rect.height - INDICATOR_OFFSET * 2;
            indicatorLabel = translate('Neos.Neos.Ui:Main:dropIndicatorLabelInto', `Move into "${neosNode?.label}"`);
        } else if (allowedAlongside && !allowedInside) {
            if (ev.clientY < rect.top + rect.height / 2) {
                // Position above the node if dropping alongside and above the center
                indicatorOffsetTop = rect.top - INDICATOR_OFFSET;
                indicatorLabel = translate('Neos.Neos.Ui:Main:dropIndicatorLabelBefore', `Move before "${neosNode?.label}"`);
            } else {
                // Position below the node if dropping alongside and below the center
                indicatorOffsetTop = rect.top + rect.height + INDICATOR_OFFSET;
                indicatorLabel = translate('Neos.Neos.Ui:Main:dropIndicatorLabelAfter', `Move after "${neosNode?.label}"`);
            }
        }

        // Give the feedback that the node can be moved and highlight the target node
        ev.dataTransfer.dropEffect = 'move';
        dropIndicatorRef.current.style.display = 'flex';
        dropIndicatorRef.current.style.top = `${indicatorOffsetTop}px`;
        dropIndicatorRef.current.style.left = `${indicatorOffsetLeft}px`;
        dropIndicatorRef.current.style.height = indicatorHeight === 'auto' ? 'auto' : `${indicatorHeight}px`;
        dropIndicatorRef.current.style.width = `${rect.width - INDICATOR_OFFSET * 2}px`;
        dropIndicatorRef.current.innerText = indicatorLabel;
    }, []);

    const handleDrop = useCallback((ev: React.DragEvent<HTMLElement>) => {
        dropIndicatorRef.current.style.display = 'none';
        // Only handle the events which match our intent
        if (!ev.dataTransfer || !ev.dataTransfer.types.includes(DRAG_APPLICATION_ID)) {
            return;
        }

        const draggedNodeAddressInGuestFrame = ev.dataTransfer.getData(DRAG_APPLICATION_ID);
        if (!draggedNodeAddressInGuestFrame) {
            ev.dataTransfer.dropEffect = "none";
            return;
        }
        const {
            contextPath: draggedNodeContextPath,
            fusionPath: draggedNodeFusionPath
        } = JSON.parse(draggedNodeAddressInGuestFrame);

        const targetNode = closestNodeInGuestFrame(ev.target);
        const targetNodeContextPath = closestContextPathInGuestFrame(targetNode);
        if (!draggedNodeContextPath || !targetNodeContextPath) {
            return;
        }

        // Calculate if the dragged node can be moved alongside or into the closest node
        // FIXME: This is probably slow and needs to be cached
        const allowedAlongside = canBeInsertedAlongside(draggedNodeContextPath, targetNodeContextPath);
        const allowedInside = canBeInsertedInto(draggedNodeContextPath, targetNodeContextPath);

        const rect = targetNode.getBoundingClientRect();
        let insertPosition = InsertPosition.AFTER;
        if (allowedInside && !allowedAlongside) {
            insertPosition = InsertPosition.INTO;
        } else if (allowedAlongside && !allowedInside) {
            if (ev.clientY < rect.top + rect.height / 2) {
                insertPosition = InsertPosition.BEFORE;
            }
        }

        // Move the node to the target context path based on the drop position
        moveNodes(
            [draggedNodeContextPath],
            targetNodeContextPath,
            insertPosition
        );

        // Remove the original node from the DOM
        // TODO: Verify that the move was successful before removing the node
        const movedNode = findNodeInGuestFrame(draggedNodeContextPath, draggedNodeFusionPath);
        if (movedNode) {
            movedNode.remove();
        }
    }, []);

    const handleDragEnd = useCallback(() => {
        // Hide the drop indicator when the drag ends
        dropIndicatorRef.current.style.display = 'none';
    }, []);

    useEffect(() => {
        const guestFrameDocument = getGuestFrameDocument();
        // FIXME: Try to make these event listener global on the guest frame
        guestFrameDocument.addEventListener('dragover', handleDragOver);
        guestFrameDocument.addEventListener('drop', handleDrop);

        return () => {
            // Cleanup event listeners and remove the arrow element
            guestFrameDocument.removeEventListener('dragover', handleDragOver);
            guestFrameDocument.removeEventListener('drop', handleDrop);
        }
    }, []);

    return (
        <div onDragStart={handleDragStart} onDragEnd={handleDragEnd} draggable={nodeCanBeDragged}>
            <IconButton
                id="neos-InlineToolbar-DragSelectedNode"
                className={className}
                disabled={destructiveOperationsAreDisabled || !canBeEdited || !nodeCanBeDragged}
                onClick={void 0}
                icon="grip-vertical"
                hoverStyle="brand"
                title={title}
            />
        </div>
    );
}

export default withReduxState(withDraggableContext(DragSelectedNode as any));
