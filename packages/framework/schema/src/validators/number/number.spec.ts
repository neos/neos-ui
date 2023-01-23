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

import { number } from "./number";

describe("number", () => {
    it("is a singleton", () => {
        expect(number() === number()).toBe(true);
    });

    describe("#ensure", () => {
        it("returns the given value if it is a number.", () => {
            const schema = number();
            const value: number = schema.ensure(42);

            expect(value).toBe(42);
        });

        it("throws if the given value is not a number.", () => {
            expect(() => {
                const schema = number();
                const value: number = schema.ensure(null);

                console.log(value);
            }).toThrowError(
                "null was expected to be of type number, but: null is not a number."
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value is a number.", () => {
            const schema = number();

            expect(schema.is(23.3)).toBe(true);
        });

        it("is not satisfied when the given value is not a number.", () => {
            const schema = number();

            expect(schema.is("bar")).toBe(false);
        });
    });
});
