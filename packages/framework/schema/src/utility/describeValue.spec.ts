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

import { describeValue } from "./describeValue";

describe("describeValue", () => {
    it("stringifies primitives", () => {
        expect(describeValue("Hello World")).toBe('"Hello World"');
        expect(describeValue(12)).toBe("12");
        expect(describeValue(12.345)).toBe("12.345");
        expect(describeValue(true)).toBe("true");
        expect(describeValue(false)).toBe("false");
    });

    it("stringifies nullish values", () => {
        expect(describeValue(null)).toBe("null");
        expect(describeValue(undefined)).toBe("undefined");
        expect(describeValue(NaN)).toBe("NaN");
    });

    it("stringifies objects", () => {
        expect(describeValue({ foo: 1 })).toBe('{"foo":1}');
        expect(describeValue({ foo: 1, bar: 2, baz: 3, qux: 4 })).toBe(
            '{"foo":1,"bar":2,"baz":3,"qux"...'
        );
    });

    it("stringifies arrays", () => {
        expect(describeValue([1, 2, 3, 4, 5])).toBe("[1,2,3,4,5]");
        expect(
            describeValue([1, 2, 3, 4, 5, "foooooo", "baaaaaar", true])
        ).toBe('[1,2,3,4,5,"foooooo","baaaaaar...');
    });

    it("stringifies classes", () => {
        class MyClass {
            property = "value";
        }

        expect(describeValue(new MyClass())).toBe(
            '<MyClass>{"property":"value"}'
        );
    });

    it("stringifies errors", () => {
        expect(describeValue(new Error("an error occurred"))).toBe(
            '<Error>{"message":"an error occurred"}'
        );
        expect(describeValue(new TypeError("a type error occurred"))).toBe(
            '<TypeError>{"message":"a type error occurred"}'
        );
    });

    it("stringifies symbols", () => {
        const mySymbol = Symbol("MySymbol");
        const mySingletonSymbol = Symbol.for("MySingletonSymbol");

        expect(describeValue(mySymbol)).toBe("Symbol(MySymbol)");
        expect(describeValue(mySingletonSymbol)).toBe(
            "Symbol(MySingletonSymbol)"
        );
    });
});
