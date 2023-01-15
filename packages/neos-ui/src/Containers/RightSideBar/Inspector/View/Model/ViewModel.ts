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

import type { ViewDto } from "@neos-project/neos-ui-api";

export class ViewModel {
    private constructor(
        private readonly data: {
            readonly name: string;
            readonly label: null | string;
            readonly view: null | string;
            readonly viewOptions: unknown;
        }
    ) {}

    public static fromViewDto = (dto: ViewDto): ViewModel =>
        new ViewModel({
            name: dto.name,
            label: dto.label,
            view: dto.view,
            viewOptions: dto.viewOptions,
        });

    public get name(): string {
        return this.data.name;
    }

    public get label(): null | string {
        return this.data.label;
    }

    public get view(): null | string {
        return this.data.view;
    }

    public get viewOptions(): unknown {
        return this.data.viewOptions;
    }
}
