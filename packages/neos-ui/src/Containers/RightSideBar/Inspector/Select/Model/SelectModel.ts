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

import { SelectDto } from "@neos-project/neos-ui-api";

import { OptionModel } from "./OptionModel";

export class SelectModel {
    public constructor(private readonly data: {
        readonly value: null|string;
        readonly options: OptionModel[];
    }) {}

    public static fromSelectDto = (dto: SelectDto): SelectModel =>
        new SelectModel({
            value: dto.value,
            options: dto.options.map(OptionModel.fromOptionDto)
        });

    public get value(): null|string {
        return this.data.value;
    }

    public get options(): OptionModel[] {
        return this.data.options;
    }
}
