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

export const array = <I>(itemValidator: Validator<I>) =>
    createValidator<I[]>({
        description: /{|\||\[|\?/.test(itemValidator.description)
            ? `(${itemValidator.description})[]`
            : `${itemValidator.description}[]`,

        *test(valueUnderTest, { fail, convert, push }) {
            if (!Array.isArray(valueUnderTest)) {
                return yield fail(
                    `${describeValue(valueUnderTest)} is not an array.`
                );
            }

            let conversions: { index: number; convert: () => I }[] = [];
            for (const [index, itemUnderTest] of valueUnderTest.entries()) {
                for (const result of spec(itemValidator).test(
                    itemUnderTest,
                    push(index)
                )) {
                    for (const failure of result.failure()) {
                        return yield fail(failure);
                    }

                    for (const convert of result.convert()) {
                        conversions.push({ index, convert });
                    }
                }
            }

            if (conversions.length) {
                yield convert(() => {
                    const result = [...valueUnderTest];

                    for (const { index, convert } of conversions) {
                        result[index] = convert();
                    }

                    return result;
                });
            }
        },
    });
