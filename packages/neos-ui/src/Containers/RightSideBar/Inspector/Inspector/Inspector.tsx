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

import type { State } from "@neos-project/framework-observable";
import { useLatestValueFrom } from "@neos-project/framework-react-hooks";

import { changeNodeProperties } from "@neos-project/neos-ui-api";

import I18n from "@neos-project/neos-ui-i18n";
import Bar from "@neos-project/react-ui-components/src/Bar/";
import Button from "@neos-project/react-ui-components/src/Button/";

import { Tabs } from "../Tabs";
import { Select } from "../Select";

import { Buffer, InspectorModel } from "./Model";

import styles from "./style.css";

export const Inspector: React.FC<{
    model: InspectorModel;
    buffer$: State<Buffer>;
    onSelectNode: (nodeContextPath: string) => void;
}> = (props) => {
    const hasUnappliedChanges =
        useLatestValueFrom(
            () => props.buffer$.map((buffer) => !buffer.isEmpty()),
            [props.buffer$]
        ) ?? false;

    const handleEscape = React.useCallback(() => {
        console.log("@TODO: handleEscape");
    }, []);
    const handleDiscard = React.useCallback(() => {
        props.buffer$.update((buffer) => buffer.discard());
    }, [props.buffer$]);
    const handleApply = React.useCallback(async () => {
        const { current: buffer } = props.buffer$;

        await changeNodeProperties({
            nodeContextPath: props.model.nodeContextPath,
            properties: buffer.toPropertyDtos(),
        });

        props.buffer$.update((buffer) => buffer.apply());
    }, [props.model, props.buffer$]);

    return (
        <div id="neos-Inspector" className={styles.inspector}>
            {hasUnappliedChanges ? (
                <div
                    role="button"
                    className={styles.unappliedChangesOverlay}
                    onClick={handleEscape}
                />
            ) : null}

            <Select
                model={props.model.selectedElement}
                headline="Neos.Neos:Main:content.inspector.inspectorView.selectedElement"
                onSelect={props.onSelectNode}
            />

            <Tabs
                model={props.model.tabs}
                buffer$={props.buffer$}
                onApply={handleApply}
            />

            <Bar position="bottom" className={styles.actions}>
                <Button
                    id="neos-Inspector-Discard"
                    style="lighter"
                    disabled={!hasUnappliedChanges}
                    onClick={handleDiscard}
                    className={`${styles.button} ${styles.discardButton}`}
                >
                    <I18n id="Neos.Neos:Main:discard" fallback="discard" />
                </Button>
                <Button
                    id="neos-Inspector-Apply"
                    style="lighter"
                    disabled={!hasUnappliedChanges}
                    onClick={handleApply}
                    className={`${styles.button} ${styles.publishButton}`}
                >
                    <I18n id="Neos.Neos:Main:apply" fallback="apply" />
                </Button>
            </Bar>
        </div>
    );
};
