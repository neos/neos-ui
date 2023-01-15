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

// @ts-ignore
import Headline from "@neos-project/react-ui-components/src/Headline/";
// @ts-ignore
import SelectBox from "@neos-project/react-ui-components/src/SelectBox/";
import I18n from "@neos-project/neos-ui-i18n";

import type { SelectModel } from "./Model";

import sidebarStyles from "../../style.css";
import styles from "./style.css";

export namespace Select {
    export type OnSelectHandler = (value: string) => void;
}

export const Select: React.FC<{
    model: SelectModel;
    headline: string;
    onSelect: Select.OnSelectHandler;
}> = (props) => (
    <section className={sidebarStyles.rightSideBar__header}>
        <Headline type="h2" className={styles.label}>
            <span>
                <I18n id={props.headline} />
            </span>
        </Headline>
        <div className={styles.content}>
            <SelectBox
                options={props.model.options}
                value={props.model.value}
                onValueChange={props.onSelect}
            />
        </div>
    </section>
);
