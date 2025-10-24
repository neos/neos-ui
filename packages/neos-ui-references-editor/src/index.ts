import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import {createReferencesEditor} from "./ReferencesEditor";

export {createEditor} from './domain'

export function registerReferenceInspectorEditor(
    globalRegistry: GlobalRegistry,
): void {
    const inspectorRegistry = globalRegistry.get('inspector');

    if (!inspectorRegistry) {
        console.warn('[Neos.Neos.Ui:ReferenceEditor]: Could not find inspector registry.');
        console.warn('[Neos.Neos.Ui:ReferenceEditor]: Skipping registration of ReferenceInspectorEditor...');
        return;
    }

    const editorsRegistry = inspectorRegistry.get<SynchronousRegistry<any>>('editors');

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ReferencesEditor', {
        component: createReferencesEditor()
    });
}
