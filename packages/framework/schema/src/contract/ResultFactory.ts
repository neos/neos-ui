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

import { Path } from "./Path";
import { Failure, Result } from "./Result";

export class ResultFactory<T> {
    private constructor(private readonly path: Path) {}

    public static create = <T>() => new ResultFactory<T>(Path.empty());

    public readonly fail = (source: string | Failure) =>
        typeof source === "string"
            ? new Result<T>({
                  failure: new Failure({ message: source, path: this.path }),
              })
            : new Result<T>({ failure: source });

    public readonly convert = (handleConversion: () => T) =>
        new Result<T>({ convert: handleConversion });

    public readonly push = <P>(key: null | string | number = null) =>
        key === null
            ? new ResultFactory<P>(this.path)
            : new ResultFactory<P>(this.path.push(key));
}
