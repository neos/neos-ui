const noop = {
    initialize() {},
    toggleFormat() {},
    createEditor() {}
};

const createCKEditorAPI = CKEDITOR => {
    if (!CKEDITOR) {
        console.error('CKEditor not found!');

        //
        // Return noop to not break things
        //
        return noop;
    }

    // an object with the following keys:
    // - formattingRules (from registry)
    // - setFormattingUnderCursor
    // - setCurrentlyEditedPropertyName
    let editorConfig = null;
    let currentEditor = null;

    const handleUserInteractionCallbackFactory = editor => event => {
        if (!event || event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            // TODO: why was the previous code all inside here? weirdo...
        }

        const formattingUnderCursor = {};
        Object.keys(editorConfig.formattingRules).forEach(key => {
            const formattingRule = editorConfig.formattingRules[key];

            if (formattingRule.command !== undefined) {
                if (!editor.getCommand(formattingRule.command)) {
                    formattingUnderCursor[key] = false;
                    return;
                }

                formattingUnderCursor[key] = editor.getCommand(formattingRule.command).state;
                return;
            }

            if (formattingRule.style !== undefined) {
                if (!editor.elementPath()) {
                    formattingUnderCursor[key] = false;
                    return;
                }

                const style = new CKEDITOR.style(formattingRule.style); // eslint-disable-line babel/new-cap

                formattingUnderCursor[key] = style.checkActive(editor.elementPath(), editor);
                return;
            }

            throw new Error(`
                An error occured while checking a format in CK Editor.
                The description parameter needs to either have a key "command" or
                a key "style" - none of which could be found.
            `);
        });

        editorConfig.setFormattingUnderCursor(formattingUnderCursor);
    };

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
            const formattingRule = editorConfig.formattingRules[formatting];
            if (!formattingRule) {
                console.warn(`Formatting instruction ${formatting} not found.`);
                return;
            }
            if (!currentEditor) {
                console.warn('Current editor not found!');
                return;
            }
            if (formattingRule.command !== undefined) {
                if (!currentEditor.getCommand(formattingRule.command)) {
                    console.warn(`Command ${currentEditor} not found.`);
                    return;
                }

                currentEditor.execCommand(formattingRule.command);
                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            if (formattingRule.style !== undefined) {
                if (!currentEditor.elementPath()) {
                    return;
                }

                const style = new CKEDITOR.style(formattingRule.style); // eslint-disable-line babel/new-cap
                const operation = style.checkActive(currentEditor.elementPath(), currentEditor) ?
                    'removeStyle' : 'applyStyle';

                currentEditor[operation](style);
                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            throw new Error(`
                An error occured while applying a format in CK Editor.
                The description parameter needs to either have a key "command",
                or "style" - none of which could be found.
            `);
        },

        createEditor(dom, finalOptions, propertyName, onChange) {
            dom.contentEditable = 'true';

            const editor = CKEDITOR.inline(dom, finalOptions);

            editor.on('loaded', () => {
                if (editor.config.buttons) {
                    editor.config.buttons.forEach(button => {
                        // The next two lines actually do the ACF auto-configuration
                        const editorFeature = editor.ui.create(button);
                        editor.addFeature(editorFeature);
                    });
                }
            });

            const handleUserInteraction = handleUserInteractionCallbackFactory(editor);

            editor.once('contentDom', () => {
                const editable = editor.editable();

                editable.attachListener(editable, 'focus', event => {
                    currentEditor = editor;
                    editorConfig.setCurrentlyEditedPropertyName(propertyName);

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
