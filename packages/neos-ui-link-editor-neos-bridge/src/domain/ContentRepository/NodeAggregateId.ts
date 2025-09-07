/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import { useSelector } from "../Extensibility/Store";
import {Any} from "ts-toolbelt";

export type NodeAggregateId = Any.Type<string, 'NodeAggregateId'>;

export function useSiteNodeAggregateId(): null | NodeAggregateId {
    const siteNodeAddress = useSelector(state => state.cr?.nodes?.siteNode);
    if (!siteNodeAddress) {
        return null;
    }
    // todo centralise node address handling
    return JSON.parse(siteNodeAddress).aggregateId;
}
