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
import {useMemo} from 'react'

export function useSiteNodeAggregateId(): null | string {
    const siteNodeAddress = useSelector(state => state.cr?.nodes?.siteNode);
    if (!siteNodeAddress) {
        return null;
    }

    // todo hack, dont parse the node address
    return useMemo(() => JSON.parse(siteNodeAddress).aggregateId, [siteNodeAddress]);
}
