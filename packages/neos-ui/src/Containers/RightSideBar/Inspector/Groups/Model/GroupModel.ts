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

import { GroupDto } from "@neos-project/neos-ui-api";

import { EditorModel } from "../../Editor";
import { ViewModel } from "../../View";

export class GroupModel {
    private constructor(
        private readonly data: {
            readonly name: string;
            readonly label: string;
            readonly icon: string;
            readonly items: (EditorModel | ViewModel)[];
        }
    ) {}

    public static fromGroupDto = (dto: GroupDto): GroupModel =>
        new GroupModel({
            name: dto.name,
            label: dto.label,
            icon: dto.icon,
            items: dto.items.map((itemDto) => {
                switch (itemDto.__type) {
                    case "Neos\\Neos\\Ui\\Application\\Dto\\Editor\\EditorDto":
                        return EditorModel.fromEditorDto(itemDto);
                    case "Neos\\Neos\\Ui\\Application\\Dto\\View\\ViewDto":
                        return ViewModel.fromViewDto(itemDto);
                    default:
                        throw new Error(
                            `Unkown group item type: ${(itemDto as any).__type}`
                        );
                }
            }),
        });

    public get name(): string {
        return this.data.name;
    }

    public get label(): string {
        return this.data.label;
    }

    public get icon(): string {
        return this.data.icon;
    }

    public get items(): (EditorModel | ViewModel)[] {
        return this.data.items;
    }
}
