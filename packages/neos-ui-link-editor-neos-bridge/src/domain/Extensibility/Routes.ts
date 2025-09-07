import {useNeos} from './NeosContext';

export interface IRoutes {
    core?: {
        modules?: {
            mediaBrowser?: string
        }
    }
}

export function useRoutes(): undefined | IRoutes;
export function useRoutes<R>(
    selector: (configuration: IRoutes) => R
): undefined | R;
export function useRoutes<R>(selector?: (configuration: IRoutes) => R): undefined | R {
    const neos = useNeos();

    if (neos.routes) {
        if (selector) {
            return selector(neos.routes);
        } else {
            return neos.routes as R;
        }
    }

    return;
}
