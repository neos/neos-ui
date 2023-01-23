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

import { hashMap } from "./hashMap";

describe("hashMap", () => {
    describe("#ensure", () => {
        it("returns the given value is a hash map and every item matches the inner type.", () => {
            const schema = hashMap(literal("foo"));
            const value: Record<string, "foo"> = schema.ensure({
                a: "foo",
                b: "foo",
                c: "foo",
            });

            expect(value).toEqual({ a: "foo", b: "foo", c: "foo" });
        });

        it("returns an empty object if the given value is an empty array.", () => {
            const schema = hashMap(literal("foo"));
            const value: Record<string, "foo"> = schema.ensure([]);

            expect(value).toEqual({});
        });

        it("throws if the given value is not a hash map.", () => {
            expect(() => {
                const schema = hashMap(literal("foo"));
                const value: Record<string, "foo"> = schema.ensure("bar");

                console.log(value);
            }).toThrowError(
                '"bar" was expected to be of type Record<string, Literal("foo")>, but: "bar" is not a plain object.'
            );
        });

        it("throws if the given value is a hash map, but at least one of the items does not match the inner type.", () => {
            expect(() => {
                const schema = hashMap(literal("foo"));
                const value: Record<string, "foo"> = schema.ensure({
                    a: "foo",
                    b: "bar",
                    c: "foo",
                });

                console.log(value);
            }).toThrowError(
                '{"a":"foo","b":"bar","c":"foo"... was expected to be of type Record<string, Literal("foo")>, but it deviated at path b: "bar" is not literally "foo".'
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value is an empty hash map.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.is({})).toBe(true);
        });

        it("is satisfied when the given value is a hash map and every item matches the inner type.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.is({ a: "foo" })).toBe(true);
            expect(schema.is({ a: "foo", b: "foo" })).toBe(true);
            expect(schema.is({ a: "foo", b: "foo", c: "foo" })).toBe(true);
        });

        it("is not satisfied when the given value is not a hash map.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.is("bar")).toBe(false);
        });

        it("is not satisfied when the given value is null.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.is(null)).toBe(false);
        });

        it("is not satisfied when the given value is undefined.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.is(undefined)).toBe(false);
        });

        it("is not satisfied when the given value is a hash map, but at least one of the items does not match the inner type.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.is({ a: "bar" })).toBe(false);
            expect(schema.is({ a: "foo", b: "bar" })).toBe(false);
            expect(schema.is({ a: "foo", b: "foo", c: "bar" })).toBe(false);
            expect(schema.is({ a: "foo", b: "bar", c: "foo" })).toBe(false);
        });
    });

    describe("#accepts", () => {
        it("is satisfied when the given value is an empty hash map.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.accepts({})).toBe(true);
        });

        it("is satisfied when the given value is an empty array.", () => {
            const schema = hashMap(literal("foo"));

            expect(schema.accepts([])).toBe(true);
        });
    });
});
