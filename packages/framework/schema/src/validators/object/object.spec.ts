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
import { object } from "./object";

describe("object", () => {
    const simpleExample = {
        schema: object({
            a: literal("foo"),
            b: literal(null),
            c: literal(42),
        }),
        matchingValueExamples: {
            ["the given value matches the object shape and every property matches the respective object shape property schema"]:
                {
                    a: "foo",
                    b: null,
                    c: 42,
                },
        },
        nonMatchingValueExamples: {
            ["the given value is a string"]: {
                value: "bar",
                errorMessage:
                    '"bar" was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: "bar" is not a plain object.',
            },
            ["the given value is a number"]: {
                value: 42,
                errorMessage:
                    '42 was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: 42 is not a plain object.',
            },
            ["the given value is literally `true`"]: {
                value: true,
                errorMessage:
                    'true was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: true is not a plain object.',
            },
            ["the given value is literally `false`"]: {
                value: false,
                errorMessage:
                    'false was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: false is not a plain object.',
            },
            ["the given value is an array"]: {
                value: [],
                errorMessage:
                    '[] was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: [] is not a plain object.',
            },
            ["the given value is null"]: {
                value: null,
                errorMessage:
                    'null was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: null is not a plain object.',
            },
            ["the given value is undefined"]: {
                value: undefined,
                errorMessage:
                    'undefined was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: undefined is not a plain object.',
            },
            ["the given value is NaN"]: {
                value: NaN,
                errorMessage:
                    'NaN was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: NaN is not a plain object.',
            },

            ["the given value is an empty object"]: {
                value: {},
                errorMessage:
                    '{} was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: {} is missing the following keys:' +
                    '\n  * a: Literal("foo")' +
                    "\n  * b: Literal(null)" +
                    "\n  * c: Literal(42)",
            },

            ["the given value does not match the object shape"]: {
                value: {
                    d: "foo",
                    e: null,
                    f: 42,
                },
                errorMessage:
                    '{"d":"foo","e":null,"f":42} was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: {"d":"foo","e":null,"f":42} is missing the following keys:' +
                    '\n  * a: Literal("foo")' +
                    "\n  * b: Literal(null)" +
                    "\n  * c: Literal(42)",
            },

            ["the given value is missing one of the properties"]: {
                value: {
                    a: "foo",
                    c: 42,
                },
                errorMessage:
                    '{"a":"foo","c":42} was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: {"a":"foo","c":42} is missing the following keys:' +
                    "\n  * b: Literal(null)",
            },

            ["the given value has all properties, but `a` has the wrong value"]:
                {
                    value: {
                        a: "bar",
                        b: null,
                        c: 42,
                    },
                    errorMessage:
                        '{"a":"bar","b":null,"c":42} was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but it deviated at path a: "bar" is not literally "foo".',
                },

            ["the given value has all properties, but `b` has the wrong value"]:
                {
                    value: {
                        a: "foo",
                        b: NaN,
                        c: 42,
                    },
                    errorMessage:
                        '{"a":"foo","b":null,"c":42} was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but it deviated at path b: NaN is not literally null.',
                },

            ["the given value has all properties, but `c` has the wrong value"]:
                {
                    value: {
                        a: "foo",
                        b: null,
                        c: 21,
                    },
                    errorMessage:
                        '{"a":"foo","b":null,"c":21} was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but it deviated at path c: 21 is not literally 42.',
                },
            ["the given value has extra keys"]: {
                value: {
                    a: "foo",
                    b: null,
                    c: 42,
                    d: { hello: "there" },
                    e: "even more!",
                },
                errorMessage:
                    '{"a":"foo","b":null,"c":42,"d"... was expected to be of type { a: Literal("foo"); b: Literal(null); c: Literal(42) }, but: {"a":"foo","b":null,"c":42,"d"... has the following disallowed extra keys:' +
                    '\n  * d: {"hello":"there"}' +
                    '\n  * e: "even more!"',
            },
        },
    };

    describe("#ensure", () => {
        it.each(Object.entries(simpleExample.matchingValueExamples))(
            "returns the given value if in the simple case %s",
            (_, givenValue: unknown) => {
                const { schema } = simpleExample;
                const value: { a: "foo"; b: null; c: 42 } =
                    schema.ensure(givenValue);

                expect(value).toEqual(givenValue);
            }
        );

        it.each(Object.entries(simpleExample.nonMatchingValueExamples))(
            "throws if in the simple case %s",
            (
                _,
                {
                    value: givenValue,
                    errorMessage: expectedErrorMessage,
                }: { value: unknown; errorMessage: string }
            ) => {
                expect(() => {
                    const { schema } = simpleExample;
                    const value: { a: "foo"; b: null; c: 42 } =
                        schema.ensure(givenValue);

                    console.log(value);
                }).toThrowError(expectedErrorMessage);
            }
        );
    });

    describe("#is", () => {
        it.each(Object.entries(simpleExample.matchingValueExamples))(
            "is satisfied when in the simple case %s",
            (_, givenValue: unknown) => {
                const { schema } = simpleExample;

                expect(schema.is(givenValue)).toBe(true);
            }
        );

        it.each(Object.entries(simpleExample.nonMatchingValueExamples))(
            "is not satisfied when in the simple case %s",
            (_, { value: givenValue }: { value: unknown }) => {
                const { schema } = simpleExample;

                expect(schema.is(givenValue)).toBe(false);
            }
        );
    });
});
