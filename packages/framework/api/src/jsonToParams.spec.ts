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

import { jsonToParams } from "./jsonToParams";

describe("jsonToParams", () => {
    const examples = [
        [
            {
                from: { foo: "1" },
                to: { foo: "1" },
            },
        ],
        [
            {
                from: { foo: { bar: "1" } },
                to: { "foo[bar]": "1" },
            },
        ],
        [
            {
                from: { foo: { bar: { baz: "1" } } },
                to: { "foo[bar][baz]": "1" },
            },
        ],
        [
            {
                from: { foo: ["1"] },
                to: { "foo[0]": "1" },
            },
        ],
        [
            {
                from: { foo: ["1", "2"] },
                to: { "foo[0]": "1", "foo[1]": "2" },
            },
        ],
        [
            {
                from: { foo: [["1"]] },
                to: { "foo[0][0]": "1" },
            },
        ],
        [
            {
                from: { foo: [{ bar: ["1"] }] },
                to: { "foo[0][bar][0]": "1" },
            },
        ],
    ];

    it.each(examples)(
        "produces PHP-readable search params from a plain object",
        (example) => {
            expect(jsonToParams(example.from)).toEqual(example.to);
        }
    );
});
