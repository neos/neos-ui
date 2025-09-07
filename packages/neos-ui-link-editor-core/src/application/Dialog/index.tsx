import * as React from 'react';
import {INeosContextProperties, NeosContext} from '@neos-project/neos-ui-link-editor-neos-bridge';

import {createEditor, EditorContext} from '../../domain';
import {Dialog} from './Dialog';

export function registerDialog(
    neosContextProperties: INeosContextProperties,
    editor: ReturnType<typeof createEditor>
): void {
    const {globalRegistry} = neosContextProperties;
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry?.set(
        'Modals/Sitegeist.Archaeopteryx',
        (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(Dialog, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    );
}
