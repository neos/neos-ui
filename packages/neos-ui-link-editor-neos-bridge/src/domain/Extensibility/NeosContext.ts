import * as React from 'react';

import {NeosContext} from "@neos-project/neos-ui-decorators";

export function useNeos() {
    const neos = React.useContext(NeosContext);

    if (!neos) {
        throw new Error('[Neos.Neos.Ui:LinkEditor]: Could not determine Neos Context.');
    }

    return neos;
}
