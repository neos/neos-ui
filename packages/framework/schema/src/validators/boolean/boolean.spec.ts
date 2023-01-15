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

import { boolean } from "./boolean";

describe("boolean", () => {
    it("is a singleton", () => {
        expect(boolean() === boolean()).toBe(true);
    });

    describe("#ensure", () => {
        it("returns the given value if it is boolean.", () => {
            const schema = boolean();
            const value: boolean = schema.ensure(false);

            expect(value).toBe(false);
        });

        it("throws if the given value is not boolean.", () => {
            expect(() => {
                const schema = boolean();
                const value: boolean = schema.ensure(42);

                console.log(value);
            }).toThrowError(
                "42 was expected to be of type boolean, but: 42 is not a boolean."
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value is boolean.", () => {
            const schema = boolean();

            expect(schema.is(true)).toBe(true);
        });

        it("is not satisfied when the given value is not boolean.", () => {
            const schema = boolean();

            expect(schema.is("bar")).toBe(false);
        });
    });
});
