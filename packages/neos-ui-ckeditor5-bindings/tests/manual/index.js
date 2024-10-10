import initializeConfigRegistry from '../../src/manifest.config';
import {bootstrap, createEditor} from '../../src/ckEditorApi';

import { SynchronousRegistry, SynchronousMetaRegistry } from '@neos-project/neos-ui-extensibility';

const fakeGlobalRegistry = new SynchronousMetaRegistry();

// I18n Registry
class FakeI18NRegistry extends SynchronousRegistry {
    translate(key) {
        return key;
    }
}
fakeGlobalRegistry.set('i18n', new FakeI18NRegistry());

const configRegistry = initializeConfigRegistry(new SynchronousRegistry());

bootstrap({
    setFormattingUnderCursor: () => {
        document.getElementById('enabledCommands').innerText = [...window.editor.commands.names()].join(', ')
    },
    setCurrentlyEditedPropertyName: () => {},
    toolbarItems: [],
    configRegistry
})

const fakeStore = {
    dispatch: () => {}
}

const createInlineEditor = createEditor(fakeStore);

createInlineEditor({
    propertyDomNode: document.getElementById('input'),
    propertyName: 'test',
    editorOptions: {
        isInline: true,
        formatting: {
            h1: true,
            h2: true,
            strong: true
        }
    },
    globalRegistry: fakeGlobalRegistry,
    userPreferences: {},
    onChange: (content) => {
        document.getElementById('output').innerText = content;
    }
}).then(editor => {
    document.getElementById('ckVersion').innerText = CKEDITOR_VERSION;

    window.editor = editor
})
