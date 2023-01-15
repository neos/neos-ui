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
// @ts-ignore
import TypedTabs from "@neos-project/react-ui-components/src/Tabs/";
const TabsComponent: any = TypedTabs; // @TODO: Tabs.Panel is missing in the type!

import { Groups } from "../Groups";
import type { Buffer } from "../Inspector";
import type { Editor } from "../Editor";

import type { TabModel } from "./Model";

import styles from "./style.css";

const panelTheme = {
    panel: styles.inspectorTabPanel,
};

export const Tab: React.FC<{
    model: TabModel;
    buffer$: State<Buffer>;
    onApply: Editor.OnApplyHandler;
}> = (props) => (
    <TabsComponent.Panel
        title={props.model.title}
        icon={props.model.icon}
        theme={panelTheme}
    >
        <Groups
            model={props.model.groups}
            buffer$={props.buffer$}
            onApply={props.onApply}
        />
    </TabsComponent.Panel>
);
