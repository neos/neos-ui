import {handleOutside} from 'Guest/Process/DOMUtils.js';

import createToolbarConfiguration from './Toolbar/index';
import getSelectionData from './Selection/index';

export default (node, property, ckApi, editorApi, dom) => {
    console.log(node, property);
    let removeBlurEvent = null;
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar,contextmenu,liststyle,tabletools',
        allowedContent: true,
        extraPlugins: 'confighelper',
        placeholder: 'Type here...'
    });
    const updateToolbarConfiguration = createToolbarConfiguration(
        node,
        property,
        ckApi,
        editor,
        editorApi
    );
    const handleUserInteraction = event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            const selectionData = getSelectionData(ckApi)(editor);

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
        removeBlurEvent && removeBlurEvent();

        handleUserInteraction(event);
        editorApi.hideToolbar();
    };
    const handleEditorFocus = event => {
        const editable = editor.editable();

        editable.attachListener(editable, 'keyup', handleUserInteraction);
        editable.attachListener(editable, 'mouseup', handleUserInteraction);
        removeBlurEvent = handleOutside('click', handleEditorBlur)(editable);
        handleUserInteraction(event);
    };

    editor.once('contentDom', () => {
        const editable = editor.editable();

        editable.attachListener(editable, 'focus', handleEditorFocus);

        editor.on('change', () => updateToolbarConfiguration());
    });

    return editor;
};
