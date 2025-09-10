import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {IEditor} from '@neos-project/neos-ui-link-editor-core';

import {createLinkButton} from './LinkButton';
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";

export function registerLinkButton(
    globalRegistry: GlobalRegistry,
    editor: IEditor
): void {
    const ckeditor5Registry = globalRegistry.get('ckEditor5');
    if (!ckeditor5Registry) {
        console.warn('[Neos.Neos.Ui:LinkEditor]: Could not find ckeditor5 registry.');
        console.warn('[Neos.Neos.Ui:LinkEditor]: Skipping registration of RTE formatter...');
        return;
    }

    const richtextToolbarRegistry = ckeditor5Registry.get<SynchronousRegistry<any>>('richtextToolbar');
    if (!richtextToolbarRegistry) {
        console.warn('[Neos.Neos.Ui:LinkEditor]: Could not find ckeditor5 richtextToolbar registry.');
        console.warn('[Neos.Neos.Ui:LinkEditor]: Skipping registration of RTE formatter...');
        return;
    }

    richtextToolbarRegistry.set('link', {
        commandName: 'link',
        component: createLinkButton(editor),
        isVisible: (config: any) => Boolean(config && config.formatting && config.formatting.a)
    });
}
