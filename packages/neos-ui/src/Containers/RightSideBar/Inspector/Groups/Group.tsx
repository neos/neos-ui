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
import ToggablePanel from "@neos-project/react-ui-components/src/ToggablePanel/";
import Icon from "@neos-project/react-ui-components/src/Icon/";
import I18n from "@neos-project/neos-ui-i18n";

import type { Buffer } from "../Inspector";
import { Editor, EditorModel } from "../Editor";
import { View, ViewModel } from "../View";

import { GroupModel } from "./Model";

import sidebarStyles from "../../style.css";
import styles from "./style.css";

const headerTheme = {
    panel__headline: styles.propertyGroupLabel, // eslint-disable-line camelcase
};

export const Group: React.FC<{
    model: GroupModel;
    buffer$: State<Buffer>;
    onApply: Editor.OnApplyHandler;
}> = (props) => {
    const renderItem = React.useCallback(
        (item: EditorModel | ViewModel) => {
            if (item instanceof EditorModel) {
                return (
                    <Editor
                        key={item.name}
                        model={item}
                        buffer$={props.buffer$}
                        onApply={props.onApply}
                    />
                );
            }

            if (item instanceof ViewModel) {
                return <View key={item.name} model={item} />;
            }

            return null;
        },
        [props.buffer$, props.onApply]
    );

    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const handlePanelToggle = React.useCallback(() => {
        setIsCollapsed((isCollapsed) => !isCollapsed);
    }, []);

    return (
        <ToggablePanel
            onPanelToggle={handlePanelToggle}
            isOpen={!isCollapsed}
            className={sidebarStyles.rightSideBar__section}
        >
            <ToggablePanel.Header theme={headerTheme}>
                {props.model.icon ? (
                    <>
                        <div className={styles.iconWrapper}>
                            <Icon icon={props.model.icon} />
                        </div>{" "}
                    </>
                ) : null}
                <I18n id={props.model.label} />
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                {props.model.items.map(renderItem)}
            </ToggablePanel.Contents>
        </ToggablePanel>
    );
};
