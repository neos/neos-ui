import getSelectionData from './CKUtility/SelectionHelpers';

// TMP!!
const styleConfig = {
    h1: {
        style: {element: 'h1'},
    },
    h2: {
        style: {element: 'h2'},
    },
    h3: {
        style: {element: 'h3'},
    },
    h4: {
        style: {element: 'h4'},
    },
    h5: {
        style: {element: 'h5'},
    },
    bold: {
        command: 'bold'
    }
};

const createCKEditorAPI = CKEDITOR => {
    if (!CKEDITOR) {
        console.error('CKEditor not found!');

        //
        // Return noop to not break things
        //
        return {};
    }


    const handleUserInteractionCallbackFactory = (editor, configuration, onActiveFormattingChange) => event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {

            const selectionData = getSelectionData(editor);

            console.log("HANDLE USER INT", selectionData);

            if (selectionData) {
                const {left, top} = selectionData.region;

                //editorApi.setToolbarPosition(left, top);
                //updateToolbarConfiguration();

                if (selectionData.isEmpty) {
                    //editorApi.hideToolbar();
                } else {
                    //editorApi.showToolbar();
                }
            }
        }

        let activeState = {};
        Object.keys(styleConfig).forEach(key => {
            const description = styleConfig[key];

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

        onActiveFormattingChange(activeState);
    }




    //
    // Perform global initialization tasks
    //
    CKEDITOR.disableAutoInline = true;

    // Public (singleton) API for CK editor
    return {
        createEditor(dom, configuration, onChange, onActiveFormattingChange) {
            const finalOptions = Object.assign(
                {
                    removePlugins: 'toolbar,contextmenu,liststyle,tabletools',
                    allowedContent: true,
                    extraPlugins: 'removeformat'
                },

                configuration.placeholder ? {
                    extraPlugins: 'confighelper',
                    placeholder: configuration.placeholder
                } : {}
            );

            dom.contentEditable = "true";

            const editor = CKEDITOR.inline(dom, finalOptions);
            const handleUserInteraction = handleUserInteractionCallbackFactory(editor, configuration, onActiveFormattingChange);

            editor.once('contentDom', () => {
                const editable = editor.editable();

                editable.attachListener(editable, 'focus', (event) => {
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
