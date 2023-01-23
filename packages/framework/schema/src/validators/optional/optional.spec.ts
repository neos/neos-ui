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

import { optional } from "./optional";

describe("optional", () => {
    describe("#ensure", () => {
        it("returns the given value if it matches the inner type.", () => {
            const schema = optional(literal("foo"));
            const value: null | "foo" = schema.ensure("foo");

            expect(value).toBe("foo");
        });

        it("returns null if the given value is null.", () => {
            const schema = optional(literal("foo"));
            const value: null | "foo" = schema.ensure(null);

            expect(value).toBe(null);
        });

        it("returns null if the given value is undefined.", () => {
            const schema = optional(literal("foo"));
            const value: null | "foo" = schema.ensure(undefined);

            expect(value).toBe(null);
        });

        it("throws if the given value does not match the inner type.", () => {
            expect(() => {
                const schema = optional(literal("foo"));
                const value: null | "foo" = schema.ensure("bar");

                console.log(value);
            }).toThrowError(
                '"bar" was expected to be of type null|Literal("foo"), but: "bar" is not literally "foo".'
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value matches the inner type.", () => {
            const schema = optional(literal("foo"));

            expect(schema.is("foo")).toBe(true);
        });

        it("is satisfied when the given value is null.", () => {
            const schema = optional(literal("foo"));

            expect(schema.is(null)).toBe(true);
        });

        it("is not satisfied when the given value is undefined.", () => {
            const schema = optional(literal("foo"));

            expect(schema.is(undefined)).toBe(false);
        });

        it("is not satisfied when the given value does not match the inner type.", () => {
            const schema = optional(literal("foo"));

            expect(schema.is("bar")).toBe(false);
        });
    });
});
