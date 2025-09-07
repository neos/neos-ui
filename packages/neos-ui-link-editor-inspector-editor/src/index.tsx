import * as React from 'react';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {INeosContextProperties, NeosContext} from '@neos-project/neos-ui-link-editor-neos-bridge';
import {EditorContext, IEditor} from '@neos-project/neos-ui-link-editor-core';

import {createInspectorEditor} from './InspectorEditor';
import {LinkDataType} from "./serialisation";

export function registerInspectorEditors(
    neosContextProperties: INeosContextProperties,
    editor: IEditor
): void {
    const {globalRegistry} = neosContextProperties;
    const inspectorRegistry = globalRegistry.get('inspector');
    if (!inspectorRegistry) {
        console.warn('[Neos.Neos.Ui:LinkEditor]: Could not find inspector registry.');
        console.warn('[Neos.Neos.Ui:LinkEditor]: Skipping registration of InspectorEditor...');
        return;
    }

    const editorsRegistry = inspectorRegistry.get<SynchronousRegistry<any>>('editors');
    if (!editorsRegistry) {
        console.warn('[Neos.Neos.Ui:LinkEditor]: Could not find inspector editors registry.');
        console.warn('[Neos.Neos.Ui:LinkEditor]: Skipping registration of InspectorEditor...');
        return;
    }

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/ValueObjectLinkEditor', {
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(createInspectorEditor(LinkDataType.valueObject), props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });

    editorsRegistry.set('Sitegeist.Archaeopteryx/Inspector/Editors/LinkEditor', {
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(createInspectorEditor(LinkDataType.string), props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });
}
