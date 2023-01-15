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

import React from "react";

import { usePromise } from "@neos-project/framework-react-hooks";
import { createState } from "@neos-project/framework-observable";

import { getInspector } from "@neos-project/neos-ui-api";

import { TabModel } from "../Tabs";
import { SelectModel } from "../Select";

import { Buffer, InspectorModel } from "./Model";
import { Inspector } from "./Inspector";

export const InspectorLoader: React.FC<{
    focusedNodeContextPath: string;
    onSelectNode: (nodeContextPath: string) => void;
}> = (props) => {
    const buffer$ = React.useMemo(() => createState(Buffer.empty()), []);

    const waitingForInspectorModel = usePromise(async () => {
        buffer$.update((buffer) => buffer.lock());

        const { tabs, selectedElement, properties } = await getInspector({
            nodeContextPath: props.focusedNodeContextPath,
        });

        buffer$.update(() => Buffer.fromPropertyDtos(properties));

        return new InspectorModel({
            nodeContextPath: props.focusedNodeContextPath,
            tabs: tabs.map(TabModel.fromTabDto),
            selectedElement: SelectModel.fromSelectDto(selectedElement),
        });
    }, [props.focusedNodeContextPath]);

    if (waitingForInspectorModel.value === null) {
        return null;
    }

    if (waitingForInspectorModel.error) {
        return <pre>{waitingForInspectorModel.error.message}</pre>;
    }

    return (
        <Inspector
            model={waitingForInspectorModel.value}
            buffer$={buffer$}
            onSelectNode={props.onSelectNode}
        />
    );
};
