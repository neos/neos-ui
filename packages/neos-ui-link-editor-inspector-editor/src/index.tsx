import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {IEditor} from '@neos-project/neos-ui-link-editor-core';

import {createInspectorEditor} from './InspectorEditor';
import {LinkDataType} from "./serialisation";
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";

export function registerInspectorEditors(
    globalRegistry: GlobalRegistry,
    editor: IEditor
): void {
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

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ValueObjectLinkEditor', {
        component: createInspectorEditor(LinkDataType.valueObject, editor)
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/LinkEditor', {
        component: createInspectorEditor(LinkDataType.string, editor)
    });
}
