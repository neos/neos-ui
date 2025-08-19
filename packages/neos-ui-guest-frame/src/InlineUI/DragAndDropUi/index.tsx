import React, {useCallback, useEffect} from "react";
// @ts-ignore
import memoize from 'lodash.memoize';
// @ts-ignore
import {connect} from 'react-redux';

import {translate} from "@neos-project/neos-ui-i18n";
import {InsertPosition, Node, NodeContextPath, NodeTypesRegistry} from "@neos-project/neos-ts-interfaces";
import {
    closestContextPathInGuestFrame,
    closestNodeInGuestFrame,
    findNodeInGuestFrame,
    getGuestFrameDocument
} from '@neos-project/neos-ui-guest-frame/src/dom';
import {GlobalState} from "@neos-project/neos-ui-redux-store/src/System";
import {actions, selectors} from "@neos-project/neos-ui-redux-store";
import {neos} from "@neos-project/neos-ui-decorators";

import style from './style.module.css';

export const DRAG_APPLICATION_ID = 'application/neos-ui';
const INDICATOR_OFFSET = 16; // Offset for the drop indicator element

const withReduxState = connect((state: GlobalState) => ({
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
                }), (a: NodeContextPath, b: NodeContextPath) => a + b),
                canBeInsertedInto: memoize((draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => canBeMovedIntoSelector(state, {
                    subject: draggedNodeContextPath,
                    reference: targetNodeContextPath,
                    role: 'content',
                }), (a: NodeContextPath, b: NodeContextPath) => a + b),
                getFocusedNode: (): Node|null => selectors.CR.Nodes.focusedSelector(state)
            }
        }
    })(component));

const DragAndDropUi: React.FC<{
    getNodeByContextPath: (contextPath: NodeContextPath) => Node | null;
    moveNodes: (nodesToBeMoved: NodeContextPath[], targetNode: NodeContextPath, position: InsertPosition) => void;
    canBeInsertedAlongside: (draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => boolean;
    canBeInsertedInto: (draggedNodeContextPath: NodeContextPath, targetNodeContextPath: NodeContextPath) => boolean;
    getFocusedNode: () => Node | null;
}> = ({
          getNodeByContextPath,
          moveNodes,
          canBeInsertedAlongside,
          canBeInsertedInto,
          getFocusedNode
      }) => {
    const dropIndicatorRef = React.useRef<HTMLDivElement>(null);
    // TODO: Find better solution than refs, to have the current state in the callbacks
    const getFocusedNodeRef = React.useRef(getFocusedNode);
    getFocusedNodeRef.current = getFocusedNode;
    const canBeInsertedAlongsideRef = React.useRef(canBeInsertedAlongside);
    canBeInsertedAlongsideRef.current = canBeInsertedAlongside;
    const canBeInsertedIntoRef = React.useRef(canBeInsertedInto);
    canBeInsertedIntoRef.current = canBeInsertedInto;
    const getNodeByContextPathRef = React.useRef(getNodeByContextPath);
    getNodeByContextPathRef.current = getNodeByContextPath;

    const handleDragOver = useCallback((ev: React.DragEvent<HTMLElement>) => {
        if (!dropIndicatorRef.current) {
            return;
        }
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
        const draggedNodeContextPath = getFocusedNodeRef.current()?.contextPath;
        if (!draggedNodeContextPath || closestContextPath === draggedNodeContextPath) {
            ev.dataTransfer.dropEffect = "none";
            dropIndicatorRef.current.style.display = 'none';
            return;
        }

        // Calculate if the dragged node can be moved alongside or into the closest node
        const allowedAlongside = canBeInsertedAlongsideRef.current(draggedNodeContextPath, closestContextPath);
        const allowedInside = canBeInsertedIntoRef.current(draggedNodeContextPath, closestContextPath);

        // Position arrow based on allowed drop positions and offset from the closest node
        if (!allowedAlongside && !allowedInside) {
            ev.dataTransfer.dropEffect = "none";
            dropIndicatorRef.current.style.display = 'none';
            return;
        }

        // Get the Neos node to access properties for the indicator
        const neosNode = getNodeByContextPathRef.current(closestContextPath);

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
        if (dropIndicatorRef.current) {
            dropIndicatorRef.current.style.display = 'none';
        }
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

        const allowedAlongside = canBeInsertedAlongsideRef.current(draggedNodeContextPath, targetNodeContextPath);
        const allowedInside = canBeInsertedIntoRef.current(draggedNodeContextPath, targetNodeContextPath);

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
        if (dropIndicatorRef.current) {
            // Hide the drop indicator when the drag ends
            dropIndicatorRef.current.style.display = 'none';
        }
    }, []);

    useEffect(() => {
        const guestFrameDocument = getGuestFrameDocument();
        guestFrameDocument.addEventListener('dragover', handleDragOver);
        guestFrameDocument.addEventListener('drop', handleDrop);
        guestFrameDocument.addEventListener('dragend', handleDragEnd);

        return () => {
            guestFrameDocument.removeEventListener('dragover', handleDragOver);
            guestFrameDocument.removeEventListener('drop', handleDrop);
            guestFrameDocument.removeEventListener('dragend', handleDragEnd);
        }
    }, []);

    return (
        <div
            id="neos-inlineToolbar-dropIndicator"
            ref={dropIndicatorRef}
            className={style.nodeDropIndicator}
        >
        </div>
    );
}

export default withReduxState(withDraggableContext(DragAndDropUi as any));
