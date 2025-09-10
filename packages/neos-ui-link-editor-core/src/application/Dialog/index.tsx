
import {IEditor} from '../../domain';
import {createDialog} from './Dialog';
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";

export function registerDialog(
    globalRegistry: GlobalRegistry,
    editor: IEditor
): void {
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry.set(
        'Modals/Sitegeist.Archaeopteryx',
        createDialog(editor)
    );
}
