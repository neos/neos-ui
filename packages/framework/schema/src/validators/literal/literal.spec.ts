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

import { literal } from "./literal";

describe("literal", () => {
    describe("#ensure", () => {
        it("returns the given value if it matches the literal.", () => {
            const schema = literal("foo");
            const value: "foo" = schema.ensure("foo");

            expect(value).toBe("foo");
        });

        it("throws if the given value does not match the literal.", () => {
            expect(() => {
                const schema = literal("foo");
                const value: "foo" = schema.ensure("bar");

                console.log(value);
            }).toThrowError(
                '"bar" was expected to be of type Literal("foo"), but: "bar" is not literally "foo".'
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value matches the literal.", () => {
            const schema = literal("foo");

            expect(schema.is("foo")).toBe(true);
        });

        it("is not satisfied when the given value does not match the literal.", () => {
            const schema = literal("foo");

            expect(schema.is("bar")).toBe(false);
        });
    });
});
