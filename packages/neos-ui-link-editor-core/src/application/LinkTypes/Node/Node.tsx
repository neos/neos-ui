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
import { useAsync } from "react-use";
import { Nullable } from "ts-toolbelt/out/Union/Nullable";
import { OptionalDeep } from "ts-toolbelt/out/Object/Optional";

import {
    useSiteNodeAggregateId,
    useConfiguration,
    useI18n,
} from "@neos-project/neos-ui-link-editor-neos-bridge";
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import { Tree } from "@neos-project/neos-ui-link-editor-custom-node-tree";

import { ILink, makeLinkType } from "../../../domain";
import { IconCard, IconLabel } from "../../../presentation";
import { Process, Field } from "../../../framework";
import { getNodeSummary } from "../../../infrastructure/http";
import {isSuitableFor} from "./NodeSpecification";

type NodeLinkModel = {
    nodeId: string;
};
type NodeLinkOptions = {
    startingPoint: string;
    baseNodeType: string;
    loadingDepth: number;
    allowedNodeTypes: string[];
};

const NodePreview: React.FC<{ nodeId: string }> = (props) => {
    const i18n = useI18n();
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const dimensionValues = useSelector(selectors.CR.ContentDimensions.active);
    const fetch__nodeSummary = useAsync(async () => {
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

    if (fetch__nodeSummary.loading) {
        return (
            <IconCard
                icon="spinner"
                title={i18n("Neos.Neos.Ui:LinkEditor.Node:loadingPreview")}
                subTitle={`node://${props.nodeId}`}
            />
        );
    }

    return (
        <IconCard
            icon={fetch__nodeSummary.value?.icon ?? "ban"}
            title={
                fetch__nodeSummary.value?.label ??
                `[${i18n(
                    "Neos.Neos.Ui:LinkEditor.Node:labelOfNonExistingNode"
                )}]`
            }
            subTitle={breadcrumbs ?? `node://${props.nodeId}`}
        />
    );
};

export const Node = makeLinkType<NodeLinkModel, NodeLinkOptions>(
    "Sitegeist.Archaeopteryx:Node",
    ({ createError }) => ({
        supportedLinkOptions: ["anchor", "title", "targetBlank", "relNofollow"],

        isSuitableFor,

        useResolvedModel: (link: ILink) => {
            const match = /node:\/\/([^#]*)(#.*)?/.exec(link.href);

            if (!match) {
                throw createError(`Cannot handle href "${link.href}".`);
            }

            const nodeId = match[1];

            return Process.success({ nodeId });
        },

        convertModelToLink: ({ nodeId }: NodeLinkModel) => ({
            href: `node://${nodeId}`,
        }),

        TabHeader: () => {
            const i18n = useI18n();

            return (
                <IconLabel icon="file">
                    {i18n("Neos.Neos.Ui:LinkEditor.Node:title")}
                </IconLabel>
            );
        },

        Preview: (props: { model: NodeLinkModel }) => {
            return <NodePreview nodeId={props.model.nodeId} />;
        },

        // eslint-disable-next-line max-len
        Editor: ({
            model,
            options,
        }: {
            model: Nullable<NodeLinkModel>;
            options: OptionalDeep<NodeLinkOptions>;
        }) => {
            const i18n = useI18n();
            const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
            const dimensionValues = useSelector(selectors.CR.ContentDimensions.active);
            const siteNodeAggregateId = useSiteNodeAggregateId();
            const defaultLoadingDepth =
                useConfiguration((c) => c.nodeTree?.loadingDepth) ?? 4;
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
                    <Field<null | string>
                        name="nodeId"
                        initialValue={model?.nodeId}
                        // eslint-disable-next-line consistent-return
                        validate={(value) => {
                            if (!value) {
                                return i18n(
                                    "Neos.Neos.Ui:LinkEditor.Node:node.validation.required"
                                );
                            }
                        }}
                    >
                        {({ input }) => (
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
                                selectedTreeNodeId={input.value ?? undefined}
                                options={{
                                    enableSearch: true,
                                    enableNodeTypeFilter: true,
                                }}
                                onSelect={(nodeId) => {
                                    input.onChange(nodeId);
                                }}
                            />
                        )}
                    </Field>
                );
            }
        },
    })
);
