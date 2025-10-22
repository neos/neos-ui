
import {IEditor} from '../../domain';
import {createDialog} from './ReferencesPropertiesDialog';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';

export function registerDialog(
    globalRegistry: GlobalRegistry,
    editor: IEditor
): void {
    const containersRegistry = globalRegistry.get('containers')!;

    containersRegistry.set(
        'Modals/ReferencesPropertiesEditor',
        createDialog(editor)
    );
}
