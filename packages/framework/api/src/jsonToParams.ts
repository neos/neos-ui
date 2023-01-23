/**
 * @neos-project/framework-api - Neos CMS backend API facade
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

type Primitive = boolean | string | number | null;
type Params = { [key: string]: string };
type PlainObject = {
    [key: string]: Primitive | PlainObject | Array<Primitive | PlainObject>;
};

export const jsonToParams = (object: PlainObject): Params => {
    let entries: [string, string][] = [];

    for (const [key, value] of Object.entries(object)) {
        entries.push(...flattenValue(value, key));
    }

    return Object.fromEntries(entries);
};

const flattenValue = (
    value: Primitive | PlainObject | Array<Primitive | PlainObject>,
    prefix: string
): [string, string][] => {
    if (Array.isArray(value)) {
        let entries: [string, string][] = [];

        for (const [index, item] of value.entries()) {
            entries.push(...flattenValue(item, `${prefix}[${index}]`));
        }

        return entries;
    }

    if (typeof value === "object" && value !== null) {
        let entries: [string, string][] = [];

        for (const [key, item] of Object.entries(value)) {
            entries.push(...flattenValue(item, `${prefix}[${key}]`));
        }

        return entries;
    }

    return [[prefix, String(value)]];
};
