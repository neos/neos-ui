import { useSelector } from "react-redux";
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
