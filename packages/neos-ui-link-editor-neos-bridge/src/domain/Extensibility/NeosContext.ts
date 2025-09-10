import * as React from 'react';

import {NeosContext} from "@neos-project/neos-ui-decorators";
import {useStore} from "react-redux";

export function useNeos() {
    const neos = React.useContext(NeosContext);

    const store = useStore();

    if (!neos) {
        throw new Error('[Neos.Neos.Ui:LinkEditor]: Could not determine Neos Context.');
    }

    return { ...neos, store };
}
