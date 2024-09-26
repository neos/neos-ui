/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import type {State} from '@neos-project/framework-observable';

import {useLatestValueFrom} from './useLatestValueFrom';

export function useLatestState<V>(state$: State<V>) {
    return useLatestValueFrom(state$, state$.current);
}
