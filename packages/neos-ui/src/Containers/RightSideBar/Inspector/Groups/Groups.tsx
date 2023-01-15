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

import { State } from "@neos-project/framework-observable";

import type { Buffer } from "../Inspector";

import { GroupModel } from "./Model";
import { Group } from "./Group";
import { Editor } from "../Editor";

export const Groups: React.FC<{
    model: GroupModel[];
    buffer$: State<Buffer>;
    onApply: Editor.OnApplyHandler;
}> = (props) => {
    const renderGroup = React.useCallback(
        (group: GroupModel) => (
            <Group
                key={group.name}
                model={group}
                buffer$={props.buffer$}
                onApply={props.onApply}
            />
        ),
        [props.buffer$, props.onApply]
    );

    return <>{props.model.map(renderGroup)}</>;
};
