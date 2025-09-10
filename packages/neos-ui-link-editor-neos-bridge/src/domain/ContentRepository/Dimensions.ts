/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

import {useSelector} from '@neos-project/neos-ui-redux-store';

export function useDimensionValues(): null | Record<string,string[]> {
    const dimensionValues = useSelector(
        (state) => state.cr?.contentDimensions?.active
    );

    return dimensionValues ?? null;
}
