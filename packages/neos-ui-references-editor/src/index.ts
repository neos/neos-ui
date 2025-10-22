import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import {createInspectorEditor} from '@neos-project/neos-ui-link-editor-inspector-editor/src/InspectorEditor';
import {LinkDataType} from '@neos-project/neos-ui-link-editor-inspector-editor/src/serialisation';
import {IEditor} from '@neos-project/neos-ui-link-editor-core';

export function registerReferenceInspectorEditor(
    globalRegistry: GlobalRegistry,
    editor: IEditor
): void {
    const inspectorRegistry = globalRegistry.get('inspector');

    if (!inspectorRegistry) {
        console.warn('[Neos.Neos.Ui:ReferenceEditor]: Could not find inspector registry.');
        console.warn('[Neos.Neos.Ui:ReferenceEditor]: Skipping registration of ReferenceInspectorEditor...');
        return;
    }

    const editorsRegistry = inspectorRegistry.get<SynchronousRegistry<any>>('editors');

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ReferencesEditor', {
        component: createInspectorEditor(LinkDataType.valueObject, editor)
    });
}
