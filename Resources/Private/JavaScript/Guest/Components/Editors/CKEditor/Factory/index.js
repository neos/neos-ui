import {handleOutside} from 'Guest/Process/DOMUtils.js';

import createToolbarConfiguration from '../Toolbar/index';

export default (ckApi, editorApi, dom, getSelectionData) => {
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar',
        allowedContent: true
    });
    const updateToolbarConfiguration = createToolbarConfiguration(ckApi, editor, editorApi);
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
                    editorApi.showToolbar();
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
