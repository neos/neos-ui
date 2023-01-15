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

import { OptionDto } from "@neos-project/neos-ui-api";

export class OptionModel {
    public constructor(
        private readonly data: {
            readonly icon: string;
            readonly label: string;
            readonly value: string;
        }
    ) {}

    public static fromOptionDto = (dto: OptionDto): OptionModel =>
        new OptionModel({
            icon: dto.icon,
            label: dto.label,
            value: dto.value,
        });

    public get icon(): string {
        return this.data.icon;
    }

    public get label(): string {
        return this.data.label;
    }

    public get value(): string {
        return this.data.value;
    }
}
