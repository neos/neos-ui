/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
import {usePromise} from '@neos-project/framework-promise-react';

import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {Tree} from '@neos-project/neos-ui-link-editor-custom-node-tree';

import {ILink, ILinkType} from '../../../domain';
import {IconCard} from '../../../presentation';
import {getNodeSummary} from '../../../infrastructure/http';
import {isSuitableFor} from './NodeSpecification';
import {useSiteNodeAggregateId} from './useSiteNodeAggregateId';
import {translate} from '@neos-project/neos-ui-i18n';
import {State} from '@neos-project/framework-observable';
import {useLatestState} from '@neos-project/framework-observable-react';
import {getConfiguration} from '@neos-project/neos-ui-configuration';
import {Label, TextInput, Tooltip} from '@neos-project/react-ui-components';

type NodeLinkModel = {
    isDirty: boolean;
    nodeId?: string;
    anchor?: {
        warning?: string,
        value?: string
    }
}

const validateModel = (values: NodeLinkModel): NodeLinkModel => ({
    ...values,
    anchor: {
        ...values.anchor,
        warning: (
            !values.anchor?.value ? undefined : (
                (values.anchor.value.startsWith(' ') || values.anchor.value.endsWith(' ')) ? (
                    translate('Neos.Neos.Ui:LinkEditor.Node:anchor.validation.leadingOrTrailingSpace')
                ) : undefined
            )
        )
    }
});

type NodeLinkOptions = {
    startingPoint?: string;
    baseNodeType?: string;
    loadingDepth?: number;
    allowedNodeTypes?: string[];
};

const NodePreview: React.FC<{ nodeId: string, anchor?: string }> = (props) => {
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const legacyDimensionValues = useSelector(selectors.CR.ContentDimensions.active);
    const fetch__nodeSummary = usePromise(async () => {
        if (!workspaceName) {
            return null;
        }
        if (!legacyDimensionValues) {
            return null;
        }
        const result = await getNodeSummary({
            workspaceName,
            legacyDimensionValues,
            nodeId: props.nodeId
        });

        if ('success' in result) {
            return result.success;
        }

        return null;
    }, [props.nodeId, workspaceName, legacyDimensionValues]);
    const breadcrumbs = fetch__nodeSummary.value?.breadcrumbs
        .map(({label}) => label)
        .join(' > ');

    if (fetch__nodeSummary.isLoading) {
        return (
            <IconCard
                icon="spinner"
                title={translate('Neos.Neos.Ui:LinkEditor.Node:loadingPreview')}
                subTitle={`node://${props.nodeId}`}
            />
        );
    }

    return (
        <IconCard
            icon={fetch__nodeSummary.value?.icon ?? 'ban'}
            title={<>
                {fetch__nodeSummary.value?.label ?? translate('Neos.Neos.Ui:LinkEditor.Node:labelOfNonExistingNode')}
                {props.anchor ? <i> #{props.anchor}</i> : ''}
            </>}
            subTitle={breadcrumbs ?? `node://${props.nodeId}`}
        />
    );
};

const createError = (message: string): Error => new Error(`[Node link type]: ${message}`);

export const Node: ILinkType<NodeLinkModel, NodeLinkOptions> = {
    id: 'Node',

    icon: 'file',

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.Node:title'),

    isSuitableFor,

    isDirty: (model) => {
        return model.isDirty;
    },

    isValid: (model) => {
        return Boolean(model.nodeId);
    },

    isAdvanced: (model) => {
        return Boolean(model.anchor?.value);
    },

    convertLinkToModel: (link: ILink) => {
        const match = /node:\/\/([^#]*)(?:#(.*))?/.exec(link.href);

        if (!match) {
            throw createError(`Cannot handle href "${link.href}".`);
        }

        const nodeId = match[1];
        const anchor = match[2];

        return validateModel({isDirty: false, nodeId, anchor: {value: anchor}});
    },

    convertModelToLink: (model: NodeLinkModel) => ({
        href: `node://${model.nodeId}${model.anchor?.value ? `#${model.anchor.value}` : ''}`
    }),

    Preview: (props: { model: NodeLinkModel }) => {
        return <NodePreview nodeId={props.model.nodeId!} anchor={props.model.anchor?.value} />;
    },

    Editor: ({
        model$,
        options
    }: {
        model$: State<NodeLinkModel | null>;
        options: NodeLinkOptions;
    }) => {
        const model = useLatestState(model$);
        const setNodeId = React.useCallback((nodeId) => model$.update((values) => validateModel({...values, isDirty: true, nodeId})), []);

        const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
        const legacyDimensionValues = useSelector(selectors.CR.ContentDimensions.active);
        const siteNodeAggregateId = useSiteNodeAggregateId();
        const defaultLoadingDepth = getConfiguration((configuration) => configuration.nodeTree?.loadingDepth ?? 4);
        const initialSearchTerm =
                useSelector((state) => state.ui?.pageTree?.query) ?? '';
        const initialNarrowNodeTypeFilter =
                useSelector((state) => state.ui?.pageTree?.filterNodeType) ??
                '';
        const startingPoint = React.useMemo(
                () => options.startingPoint ?? siteNodeAggregateId,
                [options.startingPoint, siteNodeAggregateId]
            );

        if (!startingPoint) {
            throw createError(
                    'Could not load node tree, because startingPoint could not be determined.'
                );
        } else if (!workspaceName) {
            throw createError(
                    'Could not load node tree, because workspaceName could not be determined.'
                );
        } else if (!legacyDimensionValues) {
            throw createError(
                    'Could not load node tree, because dimensionValues could not be determined.'
                );
        } else {
            return <Tree
                initialSearchTerm={initialSearchTerm}
                workspaceName={workspaceName}
                legacyDimensionValues={legacyDimensionValues}
                startingPoint={startingPoint}
                loadingDepth={options.loadingDepth ?? defaultLoadingDepth}
                baseNodeTypeFilter={options.baseNodeType ?? 'Neos.Neos:Document'}
                initialNarrowNodeTypeFilter={initialNarrowNodeTypeFilter}
                linkableNodeTypes={options.allowedNodeTypes}
                selectedTreeNodeId={model?.nodeId ?? undefined}
                options={{
                    enableSearch: true,
                    enableNodeTypeFilter: true
                }}
                onSelect={setNodeId}
            />;
        }
    },

    AdvancedEditor: ({model$}: { model$: State<NodeLinkModel | null> }) => {
        const model = useLatestState(model$);
        const setAnchor = React.useCallback((anchor) => model$.update((values) => validateModel({...values, isDirty: true, anchor: {value: anchor}})), []);

        return (
            <div>
                <Label htmlFor="neos-LinkEditor-Node-anchor">
                    {translate('Neos.Neos.Ui:LinkEditor.Node:anchor.label')}
                </Label>
                <TextInput
                    id="neos-LinkEditor-Node-anchor"
                    type="text"
                    value={model?.anchor?.value ?? ''}
                    placeholder={translate('Neos.Neos.Ui:LinkEditor.Node:anchor.placeholder')}
                    onChange={setAnchor}
                />
                {model?.anchor?.warning ? (
                    <Tooltip renderInline asWarning>{model.anchor.warning}</Tooltip>
                ) : null}
            </div>
        );
    }
};
