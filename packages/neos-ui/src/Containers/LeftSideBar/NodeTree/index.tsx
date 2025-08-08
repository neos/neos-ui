import React, {useState, useCallback} from 'react';
// @ts-expect-error
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {Tree, Icon} from '@neos-project/react-ui-components';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {
    SelectionModeTypes,
    Node,
    GlobalRegistry,
    NodeTypesRegistry,
    I18nRegistry
} from '@neos-project/neos-ts-interfaces';
import {dndTypes} from '@neos-project/neos-ui-constants';

import {PageTreeNode, ContentTreeNode} from './Node/index';

import style from './style.module.css';
import {neos} from '@neos-project/neos-ui-decorators';
import {NeosContextInterface} from "@neos-project/neos-ui-decorators/src/neos";

interface ConnectedDragLayerProps {
    currentlyDraggedNodes?: string[];
    ChildRenderer: React.ComponentType<any>;
}

const ConnectedDragLayer = connect((state: any, {currentlyDraggedNodes}: ConnectedDragLayerProps) => {
    const getNodeByContextPath = selectors.CR.Nodes.nodeByContextPath(state);
    return {
        currentlyDraggedNodes: currentlyDraggedNodes ? currentlyDraggedNodes.map(contextPath => getNodeByContextPath(contextPath)) : []
    };
})(Tree.DragLayer);

interface NodeTreeProps {
    ChildRenderer: React.ComponentType<any>;
    rootNode: Node;
    allowOpeningNodesInNewWindow?: boolean;
    nodeTypeRole?: string;
    toggle: (contextPath: string) => void;
    collapseAll: (nodeContextPaths: string[], collapsedByDefaultNodesContextPaths: string[]) => void;
    focus: (contextPath: string, intermediateContextPaths?: string[], selectionMode?: SelectionModeTypes) => void;
    requestScrollIntoView?: (shouldScrollIntoView: boolean) => void;
    setActiveContentCanvasSrc?: (src: string) => void;
    setActiveContentCanvasContextPath?: (contextPath: string) => void;
    moveNodes: (nodeContextPaths: string[], targetNodeContextPath: string | undefined, position: string) => void;
    allCollapsibleNodes: {[key: string]: Node};
    loadingDepth: number;
    focusedNodesContextPaths: string[];
    i18nRegistry: {
        translate: (id: string, fallback: string, params?: object) => string;
    };
}

const NodeTree = (props: NodeTreeProps) => {
    const {
        ChildRenderer,
        rootNode,
        toggle,
        collapseAll,
        allCollapsibleNodes,
        loadingDepth,
        focus,
        setActiveContentCanvasSrc,
        setActiveContentCanvasContextPath,
        requestScrollIntoView,
        moveNodes,
        focusedNodesContextPaths,
        i18nRegistry
    } = props;

    const [currentlyDraggedNodes, setCurrentlyDraggedNodes] = useState<string[]>([]);

    const handleToggle = useCallback((contextPath: string) => {
        toggle(contextPath);
    }, [toggle]);

    const handleCollapseAll = useCallback(() => {
        let nodeContextPaths: string[] = []
        const collapsedByDefaultNodesContextPaths: string[] = []

        Object.values(allCollapsibleNodes).forEach(node => {
            const collapsedByDefault = loadingDepth === 0 ? false : node.depth - rootNode.depth >= loadingDepth
            if (collapsedByDefault) {
                collapsedByDefaultNodesContextPaths.push(node.contextPath)
            } else {
                nodeContextPaths.push(node.contextPath)
            }
        });

        // Do not Collapse RootNode
        nodeContextPaths = nodeContextPaths.filter(i => i !== rootNode.contextPath);
        collapseAll(nodeContextPaths, collapsedByDefaultNodesContextPaths);
    }, [collapseAll, allCollapsibleNodes, rootNode, loadingDepth]);

    const handleFocus = useCallback((contextPath: string, metaKeyPressed: boolean, altKeyPressed: boolean, shiftKeyPressed: boolean) => {
        if (altKeyPressed) {
            return;
        }
        const selectionMode = shiftKeyPressed ? SelectionModeTypes.RANGE_SELECT : (metaKeyPressed ? SelectionModeTypes.MULTIPLE_SELECT : SelectionModeTypes.SINGLE_SELECT);

        focus(contextPath, undefined, selectionMode);
    }, [focus]);

    const handleClick = useCallback((src: string, contextPath: string, metaKeyPressed: boolean, altKeyPressed: boolean, shiftKeyPressed: boolean) => {
        if (altKeyPressed) {
            window.open(window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname + '?node=' + contextPath);
            return;
        }

        if (metaKeyPressed || shiftKeyPressed) {
            return;
        }

        // Set a flag that will imperatively tell ContentCanvas to scroll to focused node
        if (requestScrollIntoView) {
            requestScrollIntoView(true);
        }
        if (setActiveContentCanvasSrc) {
            setActiveContentCanvasSrc(src);
        }
        if (setActiveContentCanvasContextPath) {
            setActiveContentCanvasContextPath(contextPath);
        }
    }, [requestScrollIntoView, setActiveContentCanvasSrc, setActiveContentCanvasContextPath]);

    const handleDrag = useCallback((node: Node) => {
        setCurrentlyDraggedNodes(
            focusedNodesContextPaths.includes(node.contextPath) ?
                focusedNodesContextPaths :
                [node.contextPath] // moving a node outside of focused nodes
        );
    }, [focusedNodesContextPaths]);

    const handleEndDrag = useCallback(() => {
        setCurrentlyDraggedNodes([]);
    }, []);

    const handleDrop = useCallback((targetNode: Node | undefined, position: string) => {
        moveNodes(currentlyDraggedNodes, targetNode?.contextPath, position);
        // We need to refocus the tree, so all focus would be reset, because its context paths have changed while moving
        // Could be removed with the new CR
        focus(targetNode?.contextPath || '');

        setCurrentlyDraggedNodes([]);
    }, [currentlyDraggedNodes, moveNodes, focus]);

    if (!rootNode) {
        return (
            <div className={style.loader}>
                <Icon icon="spinner" spin={true} />
            </div>
        );
    }

    const classNames = mergeClassNames({
        [style.pageTree]: true
    });

    return (
        <Tree className={classNames}>
            <button
                onClick={handleCollapseAll}
                className={style.collapseAll}
                title={i18nRegistry.translate('Neos.Neos.Ui:Main:collapseAll', 'Collapse All')}
            >
                <Icon className={style.collapseAllIcon} icon="compress-alt"/>
            </button>
            <ConnectedDragLayer
                nodeDndType={dndTypes.NODE}
                ChildRenderer={ChildRenderer}
                currentlyDraggedNodes={currentlyDraggedNodes}
            />
            <ChildRenderer
                ChildRenderer={ChildRenderer}
                nodeDndType={dndTypes.NODE}
                node={rootNode}
                level={1}
                onNodeToggle={handleToggle}
                onNodeClick={handleClick}
                onNodeFocus={handleFocus}
                onNodeDrag={handleDrag}
                onNodeDrop={handleDrop}
                onNodeEndDrag={handleEndDrag}
                currentlyDraggedNodes={currentlyDraggedNodes}
            />
        </Tree>
    );
};

export default NodeTree;

interface WithNodeTypeRegistryAndI18nRegistryProps {
    nodeTypesRegistry: NodeTypesRegistry;
    i18nRegistry: I18nRegistry;
}

const withNodeTypeRegistryAndI18nRegistry = neos((globalRegistry: GlobalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}));

export const PageTree = withNodeTypeRegistryAndI18nRegistry(connect(
    (state: any, {neos, nodeTypesRegistry}: WithNodeTypeRegistryAndI18nRegistryProps & {neos: NeosContextInterface}) => {
        const documentNodesSelector = selectors.CR.Nodes.makeGetCollapsibleDocumentNodes(nodeTypesRegistry);
        return ({
            rootNode: selectors.CR.Nodes.siteNodeSelector(state),
            focusedNodesContextPaths: selectors.UI.PageTree.getAllFocused(state),
            ChildRenderer: PageTreeNode,
            allowOpeningNodesInNewWindow: true,
            loadingDepth: neos.configuration.structureTree.loadingDepth,
            allCollapsibleNodes: documentNodesSelector(state)
        })
    }, {
        toggle: actions.UI.PageTree.toggle,
        collapseAll: actions.UI.PageTree.collapseAll,
        focus: actions.UI.PageTree.focus,
        setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
        setActiveContentCanvasContextPath: actions.CR.Nodes.setDocumentNode,
        moveNodes: actions.CR.Nodes.moveMultiple,
        requestScrollIntoView: null,
        isContentTree: false
    }, (stateProps: any, dispatchProps: any, ownProps: any) => {
        return Object.assign({}, stateProps, dispatchProps, ownProps);
    }
)(NodeTree));

export const ContentTree = withNodeTypeRegistryAndI18nRegistry(connect(
    (state: any, {neos, nodeTypesRegistry}: WithNodeTypeRegistryAndI18nRegistryProps & {neos: NeosContextInterface}) => {
        const contentNodesSelector = selectors.CR.Nodes.makeGetCollapsibleContentNodes(nodeTypesRegistry);
        return ({
            rootNode: selectors.CR.Nodes.documentNodeSelector(state),
            focusedNodesContextPaths: selectors.CR.Nodes.focusedNodePathsSelector(state),
            ChildRenderer: ContentTreeNode,
            allowOpeningNodesInNewWindow: false,
            loadingDepth: neos.configuration.structureTree.loadingDepth,
            allCollapsibleNodes: contentNodesSelector(state)
        })
    }, {
        toggle: actions.UI.ContentTree.toggle,
        collapseAll: actions.UI.ContentTree.collapseAll,
        focus: actions.CR.Nodes.focus,
        moveNodes: actions.CR.Nodes.moveMultiple,
        requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView,
        isContentTree: true
    }, (stateProps: any, dispatchProps: any, ownProps: any) => {
        return Object.assign({}, stateProps, dispatchProps, ownProps);
    }
)(NodeTree));
