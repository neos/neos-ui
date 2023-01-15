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

const shorten = (output: string) => {
    return output.length > 30 ? output.substr(0, 30) + "..." : output;
};

export const describeValue = (value: any): string => {
    switch (true) {
        case value === undefined:
            return "undefined";
        case Number.isNaN(value):
            return "NaN";
        case value instanceof Error:
            return `<${value.constructor.name}>${JSON.stringify({
                message: value.message,
            })}`;
        case typeof value === "object" &&
            value !== null &&
            value.constructor.name !== undefined &&
            value.constructor.name !== "Array" &&
            value.constructor.name !== "Object":
            return `<${value.constructor.name}>${shorten(
                JSON.stringify(value)
            )}`;
        case typeof value === "symbol":
            return String(value);
        default:
            return shorten(JSON.stringify(value));
    }
};
