import React, {useCallback} from 'react';
// @ts-ignore
import {connect} from 'react-redux';
import memoize from 'lodash.memoize';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n'
import {GlobalState} from "@neos-project/neos-ui-redux-store/src/System";
import {neos} from "@neos-project/neos-ui-decorators";
import {Node, NodeTypeName, NodeTypesRegistry} from '@neos-project/neos-ts-interfaces';
import {DRAG_APPLICATION_ID} from '../../../DragAndDropUi';

type DragSelectedNodeProps = {
    node: Node;
    className?: string;
    focusedFusionPath: string | null;
    destructiveOperationsAreDisabled: boolean;
    canBeEdited: boolean;
    canBeDragged: (nodeTypeName: NodeTypeName) => boolean;
}

const withReduxState = connect((state: GlobalState) => ({
    // TODO: Implement an actual selector to get the focused node's fusion path (not the only spot where we don't use selectors but the raw state in the UI)
    focusedFusionPath: state?.cr?.nodes?.focused?.fusionPath,
    node: selectors.CR.Nodes.focusedSelector(state),
}), {
});

const withNeosGlobals = neos((globalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

const withDraggableContext = (component: React.FC) => withNeosGlobals(
    connect((_state: GlobalState, {nodeTypesRegistry}: { nodeTypesRegistry: NodeTypesRegistry }) => {
        return () => {
            return {
                canBeDragged: memoize((nodeTypeName: NodeTypeName) => !nodeTypesRegistry.hasRole(nodeTypeName, 'document')),
            }
        }
    })(component));

const DragSelectedNode: React.FC<DragSelectedNodeProps> = ({
    className,
    node,
    focusedFusionPath,
    destructiveOperationsAreDisabled,
    canBeEdited,
    canBeDragged,
}) => {
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

    return (
        <div onDragStart={handleDragStart} draggable={nodeCanBeDragged}>
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
