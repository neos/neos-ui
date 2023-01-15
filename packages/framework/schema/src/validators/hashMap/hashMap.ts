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

export const hashMap = <I>(itemValidator: Validator<I>) =>
    createValidator<Record<string, I>>({
        description: `Record<string, ${itemValidator.description}>`,

        *test(valueUnderTest, { fail, push, convert }) {
            if (Array.isArray(valueUnderTest) && valueUnderTest.length === 0) {
                // We're dealing with PHP data structures, where an array can be both,
                // a hashmap or an actual array. During JSON serialization, an empty
                // hashmap is indistinguishable from an empty array, so we need to
                // convert empty arrays at this point.
                return yield convert(() => ({}));
            }

            if (valueUnderTest?.constructor !== Object) {
                return yield fail(
                    `${describeValue(valueUnderTest)} is not a plain object.`
                );
            }

            let conversions: [string, () => I][] = [];
            for (const [key, itemUnderTest] of Object.entries(valueUnderTest)) {
                for (const result of spec(itemValidator).test(
                    itemUnderTest,
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
                yield convert(() => ({
                    ...valueUnderTest,
                    ...Object.fromEntries(
                        conversions.map(([key, convert]) => [key, convert()])
                    ),
                }));
            }
        },
    });
