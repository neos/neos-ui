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
// @ts-ignore
import EditorEnvelope from "@neos-project/neos-ui-editors/src/EditorEnvelope/index";

import type { Buffer } from "../Inspector";

import { EditorModel } from "./Model";

import styles from "./style.css";

export namespace Editor {
    export type OnApplyHandler = (editor: EditorModel, value: unknown) => void;
}

export const Editor: React.FC<{
    model: EditorModel;
    buffer$: State<Buffer>;
    onApply: Editor.OnApplyHandler;
}> = (props) => {
    const validationErrors = React.useMemo(() => [], []);
    const value = useLatestValueFrom(
        () => props.buffer$.map((buffer) => buffer.get(props.model.name)),
        [props.model, props.buffer$]
    );
    const isLocked = useLatestValueFrom(
        () => props.buffer$.map((buffer) => buffer.isLocked()),
        [props.buffer$]
    );
    const hooks = useLatestValueFrom(
        () => props.buffer$.map((buffer) => buffer.getHooks(props.model.name)),
        [props.model, props.buffer$]
    );

    const handleCommit = React.useCallback(
        (value: any, hooks: unknown) => {
            props.buffer$.update((buffer) =>
                buffer
                    .withValue(props.model.name, value)
                    .withHooks(props.model.name, hooks)
            );
        },
        [props.model, props.buffer$]
    );
    const handleKeyPress = React.useCallback(() => {
        console.log("@TODO: handleKeyPress", props.model.name);
    }, [props.model.name]);
    const handleApply = React.useCallback(
        () => props.onApply(props.model, value),
        [props.model, props.onApply, value]
    );
    const renderSecondaryInspector = React.useCallback(() => {
        console.log("@TODO: renderSecondaryInspector", props.model.name);
    }, [props.model.name]);

    return (
        <div className={styles.wrap}>
            <EditorEnvelope
                identifier={props.model.name}
                label={props.model.label}
                editor={props.model.editor}
                options={
                    isLocked
                        ? {
                              ...(props.model.editorOptions as any),
                              disabled: true,
                          }
                        : props.model.editorOptions
                }
                helpMessage={props.model.helpMessage}
                helpThumbnail={props.model.helpThumbnail}
                commit={handleCommit}
                validationErrors={validationErrors}
                value={value}
                hooks={hooks}
                onKeyPress={handleKeyPress}
                onEnterKey={handleApply}
                renderSecondaryInspector={renderSecondaryInspector}
            />
        </div>
    );
};
