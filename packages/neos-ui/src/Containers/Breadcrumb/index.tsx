import React from 'react';
import {connect} from 'react-redux';

import {actions, selectors, GlobalState} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {Node} from '@neos-project/neos-ui-contentrepository-model';
import {NodeTypesRegistry} from '@neos-project/neos-ui-contentrepository';
import {Button, Icon} from '@neos-project/react-ui-components';
import {stripTags, decodeHtml} from '@neos-project/utils-helpers';

import style from './style.module.css';

const decodeLabel = (label: string) => decodeHtml(stripTags(label || ''));

const withReduxState = connect((state: GlobalState) => ({
    focusedNodeParentLine: selectors.CR.Nodes.focusedNodeParentLineSelector(state),
    focusedNode: selectors.CR.Nodes.focusedSelector(state)
}), {
    focusNode: actions.CR.Nodes.focus,
    requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView
});

const withNeosGlobals = neos((globalRegistry) => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

const Breadcrumb: React.FC<{
    focusedNode: Node | null,
    focusedNodeParentLine: Node[],
    focusNode: (contextPath: string) => void,
    nodeTypesRegistry: NodeTypesRegistry,
    requestScrollIntoView: (value: boolean) => void
}> = ({
    focusedNode,
    focusedNodeParentLine,
    focusNode,
    nodeTypesRegistry,
    requestScrollIntoView
}) => {
    const handleSelectNode = React.useCallback((selectedNodeContextPath: string) => {
        if (selectedNodeContextPath && selectedNodeContextPath !== focusedNode?.contextPath) {
            focusNode(selectedNodeContextPath);
        }
        requestScrollIntoView(true);
    }, [focusNode, focusedNode]);

    const closestDocumentNodeInParentLineIndex = focusedNodeParentLine
        .findIndex((node) => node && nodeTypesRegistry.hasRole(node.nodeType, 'document'));

    if (closestDocumentNodeInParentLineIndex !== -1) {
        focusedNodeParentLine = focusedNodeParentLine
            .slice(0, Math.min(2, closestDocumentNodeInParentLineIndex + 1));
    }

    if (!focusedNode || focusedNodeParentLine.length === 0) {
        return null;
    }

    return (
        <section className={style.breadcrumb}>
            <ol>
                {focusedNodeParentLine
                    .reverse()
                    .map((node, index) => {
                        if (!node) {
                            return (
                                <li key={index}>
                                    <Icon icon="question-circle" />
                                </li>
                            )
                        }
                        const nodeType = nodeTypesRegistry.get(node.nodeType);
                        const isActive = node.contextPath === focusedNode.contextPath;
                        const labelMaxLength = isActive ? 30 : 15;
                        const label = decodeLabel(node.label).trim();
                        return (
                            <li key={node.contextPath}>
                                <Button
                                    onClick={() => handleSelectNode(node.contextPath)}
                                    style="transparent"
                                    hoverStyle="clean"
                                    size="small"
                                    title={label}
                                >
                                    <Icon icon={nodeType?.ui?.icon || 'file'} />
                                    {label.slice(0, labelMaxLength) + (label.length > labelMaxLength ? '…' : '')}
                                </Button>
                            </li>
                        )
                    })}
            </ol>
        </section>
    );
}

export default React.memo(withReduxState(withNeosGlobals(Breadcrumb as any)));
