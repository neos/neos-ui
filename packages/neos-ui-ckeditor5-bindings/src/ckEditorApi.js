import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

let currentEditor = null;
let editorConfig = {};

// We cache the "formattingUnderCursor"; to only emit events when it really changed.
// As there is only a single cursor active at any given time, it is safe to do this caching here inside the singleton object.
let lastFormattingUnderCursorSerialized = '';

const handleUserInteractionCallback = () => {
    const formattingUnderCursor = {};
    editorConfig.toolbarItems.forEach(toolbarItem => {
        const commandName = toolbarItem.commandName;
        if (commandName) {
            const command = currentEditor.commands.get(commandName);
            if (!command) {
                formattingUnderCursor[commandName] = false;
                return;
            }
            formattingUnderCursor[commandName] = command.value;
        }
    });

    const formattingUnderCursorSerialized = JSON.stringify(formattingUnderCursor);
    if (formattingUnderCursorSerialized !== lastFormattingUnderCursorSerialized) {
        editorConfig.setFormattingUnderCursor(formattingUnderCursor);
        lastFormattingUnderCursorSerialized = formattingUnderCursorSerialized;
    }
};

export const bootstrap = _editorConfig => {
    editorConfig = _editorConfig;
};

export const createEditor = ({propertyDomNode, propertyName, contextPath, editorOptions, globalRegistry, userPreferences, persistChange}) => {
    const ckEditorConfig = editorConfig.configRegistry.getCkeditorConfig({
        editorOptions,
        userPreferences,
        globalRegistry
    });

    DecoupledEditor
        .create(propertyDomNode, ckEditorConfig)
        .then(editor => {
            editor.ui.focusTracker.on('change:isFocused', event => {
                if (event.source.isFocused) {
                    currentEditor = editor;
                    editorConfig.setCurrentlyEditedPropertyName(propertyName);
                }
            });

            editor.model.document.on('change', () => handleUserInteractionCallback());
            editor.model.document.on('change:data', debounce(throttle(() => persistChange({
                type: 'Neos.Neos.Ui:Property',
                subject: contextPath,
                payload: {
                    propertyName,
                    value: editor.getData(),
                    isInline: true
                }
            }), 1500), 150));
        }).catch(e => console.error(e));
};

export const executeCommand = (command, argument, reFocusEditor = true) => {
    currentEditor.execute(command, argument);
    if (reFocusEditor) {
        currentEditor.editing.view.focus();
    }
};
