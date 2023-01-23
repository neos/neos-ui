/**
 * @neos-project/neos-ui - Neos CMS UI written in ReactJS and a ton of other fun technology.
 *   Copyright (C) 2023 Contributors of Neos CMS
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { getRenderedNode } from "@neos-project/neos-ui-api";
import {
    findAllChildNodes,
    findAllOccurrencesOfNodeInGuestFrame,
    getGuestFrameDocument,
    // @ts-ignore
} from "@neos-project/neos-ui-guest-frame/src/dom";
// @ts-ignore
import initializeContentDomNode from "@neos-project/neos-ui-guest-frame/src/initializeContentDomNode";
import { actions, selectors } from "@neos-project/neos-ui-redux-store";

const reloadContentElement = async (
    el: HTMLElement
): Promise<null | HTMLElement> => {
    const {
        __neosFusionPath: fusionPath,
        __neosNodeContextpath: nodeContextPath,
    } = el.dataset;

    if (fusionPath && nodeContextPath) {
        const { html } = await getRenderedNode({
            nodeContextPath,
            fusionPath,
        });

        const tempNodeInGuest = getGuestFrameDocument().createElement("div");
        tempNodeInGuest.innerHTML = html;

        return tempNodeInGuest.querySelector(
            `[data-__neos-node-contextpath="${nodeContextPath}"]`
        );
    }

    return null;
};

export const makeReloadAllOccurrencesOfNodeInGuestFrame = (deps: {
    globalRegistry: any;
    store: any;
}) => {
    const nodeTypesRegistry = deps.globalRegistry.get(
        "@neos-project/neos-ui-contentrepository"
    );
    const inlineEditorRegistry = deps.globalRegistry.get("inlineEditors");

    const initializeContentElement = (contentElement: HTMLElement): void => {
        const { __neosNodeContextpath: nodeContextPath } =
            contentElement.dataset;
        if (nodeContextPath) {
            const children = findAllChildNodes(contentElement) as HTMLElement[];

            const nodes = Object.assign(
                {
                    [nodeContextPath]: (
                        selectors as any
                    ).CR.Nodes.byContextPathSelector(nodeContextPath)(
                        deps.store.getState()
                    ),
                },
                ...children.map((el) => {
                    const contextPath = el.getAttribute(
                        "data-__neos-node-contextpath"
                    )!;
                    return {
                        [contextPath]: (
                            selectors as any
                        ).CR.Nodes.byContextPathSelector(contextPath)(
                            deps.store.getState()
                        ),
                    };
                })
            );

            //
            // Initialize the newly rendered node and all nodes that came with it
            //
            [contentElement, ...children].forEach(
                initializeContentDomNode({
                    store: deps.store,
                    globalRegistry: deps.globalRegistry,
                    nodeTypesRegistry,
                    inlineEditorRegistry,
                    nodes,
                })
            );
        }
    };

    const reloadAllOccurrencesOfNodeInGuestFrame = async (
        nodeContextPath: string
    ) => {
        const elements = findAllOccurrencesOfNodeInGuestFrame(
            nodeContextPath
        ) as HTMLElement[];
        let latestFusionPath: null | string = null;

        await Promise.all(
            elements.map(async (el) => {
                const contentElement = await reloadContentElement(el);

                if (contentElement && el.parentElement) {
                    latestFusionPath =
                        contentElement.dataset.__neosFusionPath ?? null;

                    el.parentElement.replaceChild(contentElement, el);
                    initializeContentElement(contentElement);
                }
            })
        );

        if (latestFusionPath) {
            deps.store.dispatch(
                (actions as any).CR.Nodes.focus(
                    nodeContextPath,
                    latestFusionPath
                )
            );
            deps.store.dispatch(
                (actions as any).UI.ContentCanvas.requestScrollIntoView(true)
            );
        }
    };

    return reloadAllOccurrencesOfNodeInGuestFrame;
};
