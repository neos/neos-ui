/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';

import type {Observable} from '@neos-project/framework-observable';

function shallowEqual(left: unknown, right: unknown): boolean {
    if (left === right) {
        return true;
    }
    if (typeof left === "object" && typeof right === "object" && left !== null && right !== null) {
        if (Array.isArray(left) || Array.isArray(right)) {
            return false;
        }
        const keys1 = Object.keys(left)
        const keys2 = Object.keys(right)

        if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
            return false;
        }

        for (const key of keys1) {
            // @ts-ignore
            if (left[key] !== right[key]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function useLatestValueFrom<V>(observable$: Observable<V>): null | V;
export function useLatestValueFrom<V, D>(
    observable$: Observable<V>,
    defaultValue: D
): D | V;

export function useLatestValueFrom<V, D>(
    observable$: Observable<V>,
    defaultValue?: D
) {
    const [value, setValue] = React.useState<null | D | V>(
        defaultValue ?? null
    );

    const valueRef = React.useRef(value);
    valueRef.current = value;

    React.useEffect(() => {
        const subscription = observable$.subscribe({
            next: (incomingValue) => {
                if (!shallowEqual(valueRef.current, incomingValue)) {
                    setValue(incomingValue);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [observable$]);

    return value;
}
