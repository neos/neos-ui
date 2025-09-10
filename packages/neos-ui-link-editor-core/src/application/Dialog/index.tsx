import * as React from 'react';
import {INeosContextProperties, NeosContext} from '@neos-project/neos-ui-link-editor-neos-bridge';

import {IEditor} from '../../domain';
import {createDialog} from './Dialog';

export function registerDialog(
    neosContextProperties: INeosContextProperties,
    editor: IEditor
): void {
    const {globalRegistry} = neosContextProperties;
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry?.set(
        'Modals/Sitegeist.Archaeopteryx',
        (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                {React.createElement(createDialog(editor), props)}
            </NeosContext.Provider>
        )
    );
}
