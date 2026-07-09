import React, {useCallback, useMemo} from 'react';
// @ts-ignore
import memoize from 'lodash.memoize';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n'
import {neos} from '@neos-project/neos-ui-decorators';
import {NodeTypeName} from '@neos-project/neos-ui-contentrepository-model';
import {NodeTypesRegistry} from '@neos-project/neos-ui-contentrepository';

import {startDraggingNode} from '../../../DragAndDropUi';

type DragSelectedNodeProps = {
    className?: string;
    destructiveOperationsAreDisabled: boolean;
    canBeEdited: boolean;
    nodeTypesRegistry: NodeTypesRegistry;
}

const withNeosGlobals = neos((globalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

const selectCanBeDragged = memoize((nodeTypesRegistry: NodeTypesRegistry) => {
    return (nodeTypeName: NodeTypeName) => !nodeTypesRegistry.hasRole(nodeTypeName, 'document');
});

const DragSelectedNode: React.FC<DragSelectedNodeProps> = ({
    className,
    destructiveOperationsAreDisabled,
    canBeEdited,
    nodeTypesRegistry
}) => {
    const focusedFusionPath = useSelector(state => state?.cr?.nodes?.focused?.fusionPath);
    const node = useSelector(selectors.CR.Nodes.focusedSelector);
    const canBeDragged = selectCanBeDragged(nodeTypesRegistry);

    if (!node) {
        return null;
    }

    const [nodeCanBeDragged, title] = useMemo((): [boolean, string] => {
        let title = translate('Neos.Neos.Ui:Main:dragSelectedNode', 'Drag selected node');
        let nodeCanBeDragged = true;
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
        return [nodeCanBeDragged, title];
    }, []);

    const handleDragStart = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        if (node.contextPath && focusedFusionPath) {
            startDraggingNode(ev, node.contextPath, focusedFusionPath);
        }
    }, [node.contextPath, focusedFusionPath]);

    return (
        <div onDragStart={handleDragStart} draggable={nodeCanBeDragged}>
            <IconButton
                id="neos-InlineToolbar-DragSelectedNode"
                className={className}
                disabled={destructiveOperationsAreDisabled || !canBeEdited || !nodeCanBeDragged}
                icon="grip-vertical"
                hoverStyle="brand"
                title={title}
                size="small"
            />
        </div>
    );
}

export default withNeosGlobals(DragSelectedNode as any);
