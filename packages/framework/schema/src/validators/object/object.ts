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

import { createValidator, Validator, spec } from "../../contract";
import { describeValue } from "../../utility/describeValue";

const objectValidatorFactory =
    (lax: boolean) =>
    <T extends Record<string, any>>(shape: {
        [K in keyof T]: Validator<T[K]>;
    }) =>
        createValidator<{ [K in keyof T]: T[K] }>({
            description: `{ ${Object.entries(shape)
                .map(([key, validator]) => `${key}: ${validator.description}`)
                .join("; ")} }`,

            *test(valueUnderTest, { fail, push, convert }) {
                if (valueUnderTest?.constructor !== Object) {
                    return yield fail(
                        `${describeValue(
                            valueUnderTest
                        )} is not a plain object.`
                    );
                }

                const keysOfValueUnderTest = Object.keys(valueUnderTest);
                const keysOfShape = Object.keys(shape) as string[];
                const missingKeys = keysOfShape.filter(
                    (key) => !keysOfValueUnderTest.includes(key)
                );

                if (missingKeys.length > 0) {
                    yield fail(
                        `${describeValue(
                            valueUnderTest
                        )} is missing the following keys:\n${missingKeys
                            .map(
                                (key) => `  * ${key}: ${shape[key].description}`
                            )
                            .join("\n")}`
                    );
                }

                const extraKeys = keysOfValueUnderTest.filter(
                    (key) => !keysOfShape.includes(key)
                );

                if (extraKeys.length > 0 && !lax) {
                    yield fail(
                        `${describeValue(
                            valueUnderTest
                        )} has the following disallowed extra keys:\n${extraKeys
                            .map(
                                (key) =>
                                    `  * ${key}: ${describeValue(
                                        (valueUnderTest as any)[key]
                                    )}`
                            )
                            .join("\n")}`
                    );
                }

                let conversions: [string, () => any][] = [];
                for (const [key, propertyValidator] of Object.entries(shape)) {
                    const propertyUnderTest = (valueUnderTest as any)[key];

                    for (const result of spec(propertyValidator).test(
                        propertyUnderTest,
                        push(key)
                    )) {
                        for (const failure of result.failure()) {
                            return yield fail(failure);
                        }

                        for (const convert of result.convert()) {
                            conversions.push([key, convert]);
                        }
                    }
                }

                if (conversions.length > 0) {
                    yield convert(
                        () =>
                            ({
                                ...valueUnderTest,
                                ...Object.fromEntries(
                                    conversions.map(([key, convert]) => [
                                        key,
                                        convert(),
                                    ])
                                ),
                            } as T)
                    );
                }
            },
        });

export const object = Object.assign(objectValidatorFactory(false), {
    lax: objectValidatorFactory(true),
});
