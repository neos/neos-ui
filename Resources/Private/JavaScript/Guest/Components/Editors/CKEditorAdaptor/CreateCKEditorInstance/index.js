import debounce from 'lodash.debounce';

import {handleOutside} from 'Guest/Process/DOMUtils.js';
import {createSignal} from 'Guest/Process/SignalRegistry/index';

const createButtonCreator = (ckApi, editor) => (icon, command) => ({
    type: 'Button',
    options: {
        icon,
        isActive: () => editor.getCommand(command) && editor.getCommand(command).state === ckApi.TRISTATE_ON,
        isEnabled: () => true,
        onClick: createSignal(
            () => editor.execCommand(command)
        )
    }
});

export default (ckApi, editorApi, dom, getSelectionData) => {
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar',
        allowedContent: true
    });

    const createButton = createButtonCreator(ckApi, editor);
    const updateToolbarConfiguration = debounce(
        editorApi.registerToolbar({
            components: [
                createButton('bold', 'bold'),
                createButton('italic', 'italic'),
                createButton('underline', 'underline'),
                createButton('subscript', 'subscript'),
                createButton('superscript', 'superscript'),
                createButton('strikethrough', 'strike'),
                createButton('list-ol', 'numberedlist'),
                createButton('list-ul', 'bulletedlist'),
                createButton('align-left', 'justifyleft'),
                createButton('align-center', 'justifycenter'),
                createButton('align-right', 'justifyright'),
                createButton('align-justify', 'justifyblock')
            ]
        }),
        100
    );
    const handleUserInteraction = event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            const selectionData = getSelectionData(editor);

            if (selectionData) {
                const {left, top} = selectionData.region;

                editorApi.setToolbarPosition(left, top);
                updateToolbarConfiguration();

                if (selectionData.isEmpty) {
                    editorApi.hideToolbar();
                } else {
                    editorApi.showToolbar(editor.name);
                }
            }
        }
    };
    const handleEditorBlur = event => {
        const editable = editor.editable();

        editable.removeListener('keyup', handleUserInteraction);
        editable.removeListener('mouseup', handleUserInteraction);

        handleUserInteraction(event);
        editorApi.hideToolbar();
    };
    const handleEditorFocus = event => {
        const editable = editor.editable();

        editable.attachListener(editable, 'keyup', handleUserInteraction);
        editable.attachListener(editable, 'mouseup', handleUserInteraction);

        handleUserInteraction(event);
    };

    editor.once('contentDom', () => {
        const editable = editor.editable();

        editable.attachListener(editable, 'focus', handleEditorFocus);
        handleOutside('click', handleEditorBlur)(editable);
        editor.on('change', () => updateToolbarConfiguration());
    });

    return editor;
};
