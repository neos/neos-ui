import * as React from 'react';

import {IConfiguration} from './Configuration';
import {IGlobalRegistry} from './GlobalRegistry';
import {IRoutes} from './Routes';
import {IStore} from './Store';

export interface INeosContextProperties {
    globalRegistry: IGlobalRegistry
    store: IStore
    configuration: IConfiguration
    routes?: IRoutes
}

export const NeosContext = React.createContext<null | INeosContextProperties>(null);

export function useNeos() {
    const neos = React.useContext(NeosContext);

    if (!neos) {
        throw new Error('[Neos.Neos.Ui:LinkEditor]: Could not determine Neos Context.');
    }

    return neos;
}
