import {useNeos} from './NeosContext';

export interface IConfiguration {
    nodeTree?: {
        loadingDepth?: number
        presets?: {
            [key: string]: {
                baseNodeType?: string
                ui?: {
                    label?: string
                    icon?: string
                }
            }
        }
    }
}

export function useConfiguration(): undefined | IConfiguration;
export function useConfiguration<R>(
    selector: (configuration: IConfiguration) => R
): undefined | R;
export function useConfiguration<R>(selector?: (configuration: IConfiguration) => R): R {
    const neos = useNeos();

    if (selector) {
        return selector(neos.configuration);
    } else {
        return neos.configuration as R;
    }
}
