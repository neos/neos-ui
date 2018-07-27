import debounce from 'lodash.debounce';
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

// We remove opening and closing span tags that are produced by the inlineMode plugin
const cleanupContentBeforeCommit = content => {
    if (content.match(/^<span>/) && content.match(/<\/span>$/)) {
        return content
            .replace(/^<span>/, '')
            .replace(/<\/span>$/, '');
    }
    return content;
};

let currentEditor = null;
let editorConfig = {};

// We cache the "formattingUnderCursor"; to only emit events when it really changed.
// As there is only a single cursor active at any given time, it is safe to do this caching here inside the singleton object.
let lastFormattingUnderCursorSerialized = '';

// We get the state of all commands from CKE5 and serialize it into "formattingUnderCursor"
const handleUserInteractionCallback = () => {
    if (!currentEditor) {
        return;
    }
    const formattingUnderCursor = {};
    [...currentEditor.commands].forEach(commandTuple => {
        const [commandName, command] = commandTuple;
        if (command.value !== undefined) {
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
        globalRegistry,
        propertyDomNode
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
            editor.model.document.on('change:data', debounce(() => persistChange({
                type: 'Neos.Neos.Ui:Property',
                subject: contextPath,
                payload: {
                    propertyName,
                    value: cleanupContentBeforeCommit(editor.getData()),
                    isInline: true
                }
            }), 350, {maxWait: 5000}));
        }).catch(e => console.error(e));
};

export const executeCommand = (command, argument, reFocusEditor = true) => {
    currentEditor.execute(command, argument);
    if (reFocusEditor) {
        currentEditor.editing.view.focus();
    }
};
