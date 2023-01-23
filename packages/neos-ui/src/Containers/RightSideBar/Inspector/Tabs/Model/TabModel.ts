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

import { TabDto } from "@neos-project/neos-ui-api";

import { GroupModel } from "../../Groups";

export class TabModel {
    private constructor(
        private readonly data: {
            readonly name: null | string;
            readonly title: null | string;
            readonly icon: null | string;
            readonly groups: GroupModel[];
        }
    ) {}

    public static fromTabDto = (dto: TabDto): TabModel =>
        new TabModel({
            name: dto.name,
            title: dto.label,
            icon: dto.icon,
            groups: dto.groups.map(GroupModel.fromGroupDto),
        });

    public get name(): null | string {
        return this.data.name;
    }

    public get title(): null | string {
        return this.data.title;
    }

    public get icon(): null | string {
        return this.data.icon;
    }

    public get groups(): GroupModel[] {
        return this.data.groups;
    }
}
