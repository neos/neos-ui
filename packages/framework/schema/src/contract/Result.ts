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

export class Result<T> {
    public constructor(
        private readonly data:
            | { failure: Failure }
            | { convert: () => T }
    ) {}

    *failure(): Generator<Failure> {
        if ("failure" in this.data) {
            yield this.data.failure;
        }
    }

    *convert(): Generator<() => T> {
        if ("convert" in this.data) {
            yield this.data.convert;
        }
    }

    public readonly atPath = (path: Path): Result<T> => {
        if ("failure" in this.data) {
            return new Result<T>({
                failure: this.data.failure.atPath(path),
            });
        }

        return this;
    };
}

export class Failure {
    public constructor(
        private readonly data: {
            readonly message: string;
            readonly path: Path;
        }
    ) {}

    public get message(): string {
        return this.data.message;
    }

    public get path(): Path {
        return this.data.path;
    }

    public readonly atPath = (path: Path) => {
        if ("failure" in this.data) {
            return new Failure({
                ...this.data,
                path,
            });
        }

        return this;
    };
}
