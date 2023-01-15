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
import ViewEnvelope from "@neos-project/neos-ui-views/src/ViewEnvelope/index";

import { ViewModel } from "./Model";

import styles from "./style.css";

export const View: React.FC<{
    model: ViewModel;
}> = (props) => {
    const renderSecondaryInspector = React.useCallback(() => {
        console.log("@TODO: renderSecondaryInspector", props.model.name);
    }, [props.model.name]);

    return (
        <div className={styles.wrap}>
            <ViewEnvelope
                identifier={props.model.name}
                label={props.model.label}
                view={props.model.view}
                options={props.model.viewOptions}
                renderSecondaryInspector={renderSecondaryInspector}
            />
        </div>
    );
};
