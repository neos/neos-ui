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

import { string } from "./string";

describe("string", () => {
    it("is a singleton", () => {
        expect(string() === string()).toBe(true);
    });

    describe("#ensure", () => {
        it("returns the given value if it is a string.", () => {
            const schema = string();
            const value: string = schema.ensure("Hello World!");

            expect(value).toBe("Hello World!");
        });

        it("throws if the given value is not a string.", () => {
            expect(() => {
                const schema = string();
                const value: string = schema.ensure(null);

                console.log(value);
            }).toThrowError(
                "null was expected to be of type string, but: null is not a string."
            );
        });
    });

    describe("#is", () => {
        it("is satisfied when the given value is a string.", () => {
            const schema = string();

            expect(schema.is("Neos is awesome!")).toBe(true);
        });

        it("is not satisfied when the given value is not a string.", () => {
            const schema = string();

            expect(schema.is(42)).toBe(false);
        });
    });
});
