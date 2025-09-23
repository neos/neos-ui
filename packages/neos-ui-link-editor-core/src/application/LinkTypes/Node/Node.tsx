/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from "react";
import {PromiseState, usePromise} from "@neos-project/framework-promise-react";
import {Nullable} from "ts-toolbelt/out/Union/Nullable";
import {OptionalDeep} from "ts-toolbelt/out/Object/Optional";

import {configuration} from "@neos-project/neos-ui/configuration";
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {Tree} from "@neos-project/neos-ui-link-editor-custom-node-tree";

import {ILink, makeLinkType} from "../../../domain";
import {IconCard} from "../../../presentation";
import {getNodeSummary} from "../../../infrastructure/http";
import {isSuitableFor} from "./NodeSpecification";
import {useSiteNodeAggregateId} from "./useSiteNodeAggregateId";
import {translate} from "@neos-project/neos-ui-i18n";
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

type NodeLinkModel = {
    isDirty: boolean;
    nodeId: string;
};
type NodeLinkOptions = {
    startingPoint: string;
    baseNodeType: string;
    loadingDepth: number;
    allowedNodeTypes: string[];
};

const NodePreview: React.FC<{ nodeId: string }> = (props) => {
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const dimensionValues = useSelector(selectors.CR.ContentDimensions.active);
    const fetch__nodeSummary = usePromise(async () => {
        if (!workspaceName) {
            return null;
        }
        if (!dimensionValues) {
            return null;
        }
        const result = await getNodeSummary({
            workspaceName,
            dimensionValues,
            nodeId: props.nodeId,
        });

        if ("success" in result) {
            return result.success;
        }

        return null;
    }, [props.nodeId, workspaceName, dimensionValues]);
    const breadcrumbs = fetch__nodeSummary.value?.breadcrumbs
        .map(({ label }) => label)
        .join(" > ");

    if (fetch__nodeSummary.isLoading) {
        return (
            <IconCard
                icon="spinner"
                title={translate("Neos.Neos.Ui:LinkEditor.Node:loadingPreview", '')}
                subTitle={`node://${props.nodeId}`}
            />
        );
    }

    return (
        <IconCard
            icon={fetch__nodeSummary.value?.icon ?? "ban"}
            title={
                fetch__nodeSummary.value?.label ??
                `[${translate("Neos.Neos.Ui:LinkEditor.Node:labelOfNonExistingNode", '')}]`
            }
            subTitle={breadcrumbs ?? `node://${props.nodeId}`}
        />
    );
};

export const Node = makeLinkType<NodeLinkModel, NodeLinkOptions>("LinkEditor:Node", ({ createError }) => ({
        icon: "file",

        getTitle: () => translate('Neos.Neos.Ui:LinkEditor.Node:title', ''),

        supportedLinkOptions: ["anchor", "title", "targetBlank", "relNofollow"],

        isSuitableFor,

        isDirty: (model) => {
            return model.isDirty;
        },

        isValid: () => {
            return true;
        },

        useResolvedModel: (link: ILink) => {
            const match = /node:\/\/([^#]*)(#.*)?/.exec(link.href);

            if (!match) {
                return PromiseState.forError(createError(`Cannot handle href "${link.href}".`));
            }

            const nodeId = match[1];

            return PromiseState.forValue({ isDirty: false, nodeId });
        },

        convertModelToLink: ({ nodeId }: NodeLinkModel) => ({
            href: `node://${nodeId}`,
        }),

        Preview: (props: { model: NodeLinkModel }) => {
            return <NodePreview nodeId={props.model.nodeId} />;
        },

        Editor: ({
            model$,
            options,
        }: {
            model$: State<Nullable<NodeLinkModel>>;
            options: OptionalDeep<NodeLinkOptions>;
        }) => {
            const model = useLatestState(model$);
            const setNodeId = React.useCallback((nodeId) => model$.update((values) => ({...values, isDirty: true, nodeId})), []);

            const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
            const dimensionValues = useSelector(selectors.CR.ContentDimensions.active);
            const siteNodeAggregateId = useSiteNodeAggregateId();
            const defaultLoadingDepth = configuration.nodeTree?.loadingDepth ?? 4;
            const initialSearchTerm =
                useSelector((state) => state.ui?.pageTree?.query) ?? "";
            const initialNarrowNodeTypeFilter =
                useSelector((state) => state.ui?.pageTree?.filterNodeType) ??
                "";
            const startingPoint = React.useMemo(
                () => options.startingPoint ?? siteNodeAggregateId,
                [options.startingPoint, siteNodeAggregateId]
            );

            if (!startingPoint) {
                throw createError(
                    "Could not load node tree, because startingPoint could not be determined."
                );
            } else if (!workspaceName) {
                throw createError(
                    "Could not load node tree, because workspaceName could not be determined."
                );
            } else if (!dimensionValues) {
                throw createError(
                    "Could not load node tree, because dimensionValues could not be determined."
                );
            } else {
                return (
                    <Tree
                        initialSearchTerm={initialSearchTerm}
                        workspaceName={workspaceName}
                        dimensionValues={dimensionValues}
                        startingPoint={startingPoint}
                        loadingDepth={options.loadingDepth ?? defaultLoadingDepth}
                        baseNodeTypeFilter={options.baseNodeType ?? "Neos.Neos:Document"}
                        initialNarrowNodeTypeFilter={
                            initialNarrowNodeTypeFilter
                        }
                        linkableNodeTypes={
                            options.allowedNodeTypes as
                                | undefined
                                | string[]
                        }
                        selectedTreeNodeId={model?.nodeId ?? undefined}
                        options={{
                            enableSearch: true,
                            enableNodeTypeFilter: true,
                        }}
                        onSelect={setNodeId}
                    />
                );
            }
        },
    })
);
