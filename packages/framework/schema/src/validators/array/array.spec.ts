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

import { array } from "./array";

describe("array", () => {
    describe("#ensure", () => {
        it("returns the given value is an array and every item matches the inner type.", () => {
            const schema = array(literal("foo"));
            const value: "foo"[] = schema.ensure(["foo", "foo", "foo"]);

            expect(value).toEqual(["foo", "foo", "foo"]);
        });

        it("throws if the given value is not an array.", () => {
            expect(() => {
                const schema = array(literal("foo"));
                const value: "foo"[] = schema.ensure("bar");

                console.log(value);
            }).toThrowError(
                '"bar" was expected to be of type Literal("foo")[], but: "bar" is not an array.'
            );
        });

        it("throws if the given value is an array, but at least one of the items does not match the inner type.", () => {
            expect(() => {
                const schema = array(literal("foo"));
                const value: "foo"[] = schema.ensure(["foo", "bar", "foo"]);

                console.log(value);
            }).toThrowError(
                '["foo","bar","foo"] was expected to be of type Literal("foo")[], but it deviated at path [1]: "bar" is not literally "foo".'
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value is an empty array.", () => {
            const schema = array(literal("foo"));

            expect(schema.is([])).toBe(true);
        });

        it("is satisfied when the given value is an array and every item matches the inner type.", () => {
            const schema = array(literal("foo"));

            expect(schema.is(["foo"])).toBe(true);
            expect(schema.is(["foo", "foo"])).toBe(true);
            expect(schema.is(["foo", "foo", "foo"])).toBe(true);
        });

        it("is not satisfied when the given value is not an array.", () => {
            const schema = array(literal("foo"));

            expect(schema.is("bar")).toBe(false);
        });

        it("is not satisfied when the given value is an array, but at least one of the items does not match the inner type.", () => {
            const schema = array(literal("foo"));

            expect(schema.is(["bar"])).toBe(false);
            expect(schema.is(["foo", "bar"])).toBe(false);
            expect(schema.is(["foo", "foo", "bar"])).toBe(false);
            expect(schema.is(["foo", "bar", "foo"])).toBe(false);
        });
    });
});
