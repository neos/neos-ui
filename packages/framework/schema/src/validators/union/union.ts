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

export const union = <T extends Array<any>>(
    ...memberValidators: { [K in keyof T]: Validator<T[K]> }
) =>
    createValidator<{ [K in keyof T]: T[K] }[number]>({
        description: memberValidators.map((v) => v.description).join("|"),

        *test(valueUnderTest, { fail, push, convert }) {
            let failures: any[] = [];

            for (const validator of memberValidators) {
                let hasFailed = false;
                for (const result of spec(validator).test(
                    valueUnderTest,
                    push()
                )) {
                    for (const failure of result.failure()) {
                        failures.push(failure);
                        hasFailed = true;
                    }

                    for (const c of result.convert()) {
                        return yield convert(c);
                    }
                }

                if (!hasFailed) {
                    return;
                }
            }

            if (failures.length > 0) {
                yield fail(
                    `${describeValue(
                        valueUnderTest
                    )} did not match any of the union schemas:\n${failures
                        .map((failure) => {
                            if (failure.path.isEmpty()) {
                                return `  * ${failure.message}`;
                            } else {
                                return `  * at path ${failure.path.toString()}: ${
                                    failure.message
                                }`;
                            }
                        })
                        .join("\n")}`
                );
            }
        },
    });
