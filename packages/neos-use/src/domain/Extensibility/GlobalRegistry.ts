import {useNeos} from './NeosContext';
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";

export function useGlobalRegistry(): GlobalRegistry {
    const neos = useNeos();
    return neos.globalRegistry;
}
