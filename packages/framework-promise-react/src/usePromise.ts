/**
 * @neos-project/framework-promise-react - Common React Hooks for the Neos UI
 *   Copyright (C) 2025 Contributors of Neos CMS
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

import React from 'react';
import {IPromiseState} from './PromiseState';

export const usePromise = <R>(
    asyncFn: () => Promise<R>,
    deps: any[]
): IPromiseState<R> => {
    const [value, setValue] = React.useState<null | R>(null);
    const [error, setError] = React.useState<null | Error>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const promiseRef = React.useRef<Promise<void> | null>(null);

    React.useEffect(() => {
        const promise = asyncFn()
            .then((value) => {
                if (promiseRef.current === promise) {
                    setValue(value);
                    setError(null);
                }
            })
            .catch((error) => {
                if (promiseRef.current === promise) {
                    if (typeof error === 'string') {
                        error = new Error(error);
                    } else if (!(error instanceof Error)) {
                        console.error('malformed error:', error);
                        error = new Error(
                            'An unexpected (and malformed) error has occurred.'
                        );
                    }

                    setValue(null);
                    setError(error);
                }
            })
            .finally(() => {
                if (promiseRef.current === promise) {
                    setIsLoading(false);
                }
            });

        setIsLoading(true);
        promiseRef.current = promise;
    }, deps);

    return {value, error, isLoading} as IPromiseState<R>;
};
