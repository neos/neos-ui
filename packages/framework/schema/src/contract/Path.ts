/**
 * @neos-project/framework-schema - Runtime schema validator for the Neos UI
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

export class Path {
    private constructor(private readonly data: (string | number)[]) {}

    public static empty = () => new Path([]);

    public readonly isEmpty = () => this.data.length === 0;

    public readonly push = (key: string | number) =>
        new Path([...this.data, key]);

    public readonly toString = (): string => {
        const [head, ...tail] = this.data;
        let result = typeof head === "number" ? `[${head}]` : head;

        for (const segment of tail) {
            result +=
                typeof segment === "number" ? `[${segment}]` : `.${segment}`;
        }

        return result;
    };
}
