import getSelectionData from './CKUtility/SelectionHelpers';

const createCKEditorAPI = CKEDITOR => {
    if (!CKEDITOR) {
        console.error('CKEditor not found!');

        //
        // Return noop to not break things
        //
        return {};
    }

    // an object with the following keys:
    // - formattingAndStyling
    // - onActiveFormattingChange
    let editorConfig = null;
    let currentEditor = null;

    const handleUserInteractionCallbackFactory = (editor) => event => {
        if (!event || event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            // TODO: why was the previous code all inside here? weirdo...
        }

        let activeState = {};
        Object.keys(editorConfig.formattingAndStyling).forEach(key => {
            const description = editorConfig.formattingAndStyling[key];

            if (description.command !== undefined) {
                if (!editor.getCommand(description.command)) {
                    activeState[key] = false;
                    return;
                }

                activeState[key] = editor.getCommand(description.command).state === CKEDITOR.TRISTATE_ON;
                return;
            }

            if (description.style !== undefined) {
                if (!editor.elementPath()) {
                    activeState[key] = false;
                    return;
                }

                const style = new CKEDITOR.style(description.style);

                activeState[key] = style.checkActive(editor.elementPath(), editor);
                return;
            }

            throw new Error(`
                An error occured while checking a format in CK Editor.
                The description parameter needs to either have a key "command" or
                a key "style" - none of which could be found.
            `);
        });

        editorConfig.onActiveFormattingChange(activeState);
    }




    //
    // Perform global initialization tasks
    //
    CKEDITOR.disableAutoInline = true;
    

    // Public (singleton) API for CK editor
    return {
        initialize(_editorConfig) {
            editorConfig = _editorConfig;
        },

        toggleFormat(formatting) {
            const description = editorConfig.formattingAndStyling[formatting];
            if (!description) {
                console.warn(`Formatting instruction ${formatting} not found.`);
                return;
            }
            if (!currentEditor) {
                console.warn(`Current editor not found!`);
                return;
            }
            if (description.command !== undefined) {
                if (!currentEditor.getCommand(description.command)) {
                    console.warn(`Command ${currentEditor} not found.`);
                    return;
                }

                currentEditor.execCommand(description.command);
                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            if (description.style !== undefined) {
                if (!currentEditor.elementPath()) {
                    return;
                }

                const style = new CKEDITOR.style(description.style);
                const operation = style.checkActive(currentEditor.elementPath(), currentEditor) ?
                    'removeStyle' : 'applyStyle';

                currentEditor[operation](style);
                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            throw new Error(`
                An error occured while applying a format in CK Editor.
                The description parameter needs to either have a key "command" or
                a key "style" - none of which could be found.
            `);
        },

        createEditor(dom, onChange, onActiveFormattingChange) {
            const finalOptions = Object.assign(
                {
                    removePlugins: 'toolbar,contextmenu,liststyle,tabletools',
                    allowedContent: true,
                    extraPlugins: 'removeformat'
            });

                /*configuration.placeholder ? {
                    extraPlugins: 'confighelper',
                    placeholder: configuration.placeholder
                } : {}
            );*/

            dom.contentEditable = 'true';

            const editor = CKEDITOR.inline(dom, finalOptions);
            const handleUserInteraction = handleUserInteractionCallbackFactory(editor, onActiveFormattingChange);

            editor.once('contentDom', () => {
                const editable = editor.editable();

                editable.attachListener(editable, 'focus', (event) => {
                    currentEditor = editor;

                    editable.attachListener(editable, 'keyup', handleUserInteraction);
                    editable.attachListener(editable, 'mouseup', handleUserInteraction);
                    handleUserInteraction(event);
                });

                editor.on('change', () => {
                    onChange(editor.getData());
                });
            });
        }
    };
};

export default createCKEditorAPI(window.CKEDITOR);
