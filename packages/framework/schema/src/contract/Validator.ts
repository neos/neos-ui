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

import { describeValue } from "../utility/describeValue";
import { Result } from "./Result";
import { ResultFactory } from "./ResultFactory";

const specificationSymbol = Symbol();

export interface Validator<T> {
    description: string;
    is(valueUnderTest: unknown): valueUnderTest is T;
    accepts(valueUnderTest: unknown): boolean;
    ensure(valueUnderTest: unknown): T;
}

interface ValidatorSpecification<T> {
    description: string;
    test(
        valueUnderTest: unknown,
        resultFactory: ResultFactory<T>
    ): Generator<Result<T>>;
}

export const spec = <T>(validator: Validator<T>): ValidatorSpecification<T> =>
    (validator as any)[specificationSymbol] as ValidatorSpecification<T>;

export const createValidator = <T>(
    validatorSpec: ValidatorSpecification<T>
): Validator<T> => {
    const resultFactory = ResultFactory.create<T>();
    const description = validatorSpec.description;
    const is = (valueUnderTest: unknown): valueUnderTest is T => {
        for (const _ of validatorSpec.test(valueUnderTest, resultFactory)) {
            return false;
        }

        return true;
    };
    const accepts = (valueUnderTest: unknown) => {
        for (const result of validatorSpec.test(
            valueUnderTest,
            resultFactory
        )) {
            for (const _ of result.failure()) {
                return false;
            }
        }

        return true;
    };
    const ensure = (valueUnderTest: unknown) => {
        for (const result of validatorSpec.test(
            valueUnderTest,
            resultFactory
        )) {
            for (const failure of result.failure()) {
                let message = `${describeValue(
                    valueUnderTest
                )} was expected to be of type ${description}`;
                if (failure.path.isEmpty()) {
                    message += `, but: ${failure.message}`;
                } else {
                    message += `, but it deviated at path ${failure.path.toString()}: ${
                        failure.message
                    }`;
                }

                throw new Error(message);
            }

            for (const convert of result.convert()) {
                return convert();
            }
        }

        return valueUnderTest as T;
    };

    return Object.freeze({
        description,
        is,
        accepts,
        ensure,
        [specificationSymbol]: validatorSpec,
    });
};
