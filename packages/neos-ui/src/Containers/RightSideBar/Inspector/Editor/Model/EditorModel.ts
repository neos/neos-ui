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

import { EditorDto } from "@neos-project/neos-ui-api";

export class EditorModel {
    private constructor(
        private readonly data: {
            readonly name: string;
            readonly label: null | string;
            readonly helpMessage: null | string;
            readonly helpThumbnail: null | string;
            readonly editor: null | string;
            readonly editorOptions: unknown;
        }
    ) {}

    public static fromEditorDto = (dto: EditorDto): EditorModel =>
        new EditorModel({
            name: dto.name,
            label: dto.label,
            helpMessage: dto.helpMessage,
            helpThumbnail: dto.helpThumbnail,
            editor: dto.editor,
            editorOptions: dto.editorOptions,
        });

    public get name(): string {
        return this.data.name;
    }

    public get label(): null | string {
        return this.data.label;
    }

    public get helpMessage(): null | string {
        return this.data.helpMessage;
    }

    public get helpThumbnail(): null | string {
        return this.data.helpThumbnail;
    }

    public get editor(): null | string {
        return this.data.editor;
    }

    public get editorOptions(): unknown {
        return this.data.editorOptions;
    }
}
