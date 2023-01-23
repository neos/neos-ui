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

import { literal } from "../literal";

import { union } from "./union";

describe("union", () => {
    describe("#ensure", () => {
        it("returns the given value if it matches one of the inner types.", () => {
            const schema = union(literal("foo"), literal(42));
            const value1: 42 | "foo" = schema.ensure("foo");
            const value2: 42 | "foo" = schema.ensure(42);

            expect(value1).toBe("foo");
            expect(value2).toBe(42);
        });

        it("throws if the given value does not match any of the inner types.", () => {
            expect(() => {
                const schema = union(literal("foo"), literal(42));
                const value: 42 | "foo" = schema.ensure("bar");

                console.log(value);
            }).toThrowError(
                '"bar" was expected to be of type Literal("foo")|Literal(42), but: "bar" did not match any of the union schemas:' +
                    '\n  * "bar" is not literally "foo".' +
                    '\n  * "bar" is not literally 42.'
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value matches one of the inner types.", () => {
            const schema = union(literal("foo"), literal(42));

            expect(schema.is("foo")).toBe(true);
            expect(schema.is(42)).toBe(true);
        });

        it("is not satisfied when the given value does not match any of the inner types.", () => {
            const schema = union(literal("foo"), literal(42));

            expect(schema.is("bar")).toBe(false);
        });
    });
});
