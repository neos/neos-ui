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

import TypedTabs from "@neos-project/react-ui-components/src/Tabs/";
const TabsComponent: any = TypedTabs; // @TODO: `theme` prop is not properly typed

import type { Buffer } from "../Inspector";

import { TabModel } from "./Model";
import { Tab } from "./Tab";

import styles from "./style.css";
import { Editor } from "../Editor";

const tabsTheme = {
    tabs__content: styles.tabsContent, // eslint-disable-line camelcase
};

export const Tabs: React.FC<{
    model: TabModel[];
    buffer$: State<Buffer>;
    onApply: Editor.OnApplyHandler;
}> = (props) => {
    const renderTab = React.useCallback(
        (tab: TabModel) => {
            const propsForTabsComponent: any = {
                // @TODO: This is awkward and `any` is dangerous here
                icon: tab.icon,
            };

            return (
                <Tab
                    key={tab.name}
                    model={tab}
                    buffer$={props.buffer$}
                    onApply={props.onApply}
                    {...propsForTabsComponent}
                />
            );
        },
        [props.buffer$, props.onApply]
    );

    return (
        <TabsComponent className={styles.tabs} theme={tabsTheme}>
            {props.model.map(renderTab)}
        </TabsComponent>
    );
};
