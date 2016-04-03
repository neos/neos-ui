import {handleOutside} from 'Guest/Process/DOMUtils.js';
import {createSignal} from 'Guest/Containers/EditorToolbar/SignalRegistry/index';

export default (ckApi, editorApi, dom, getSelectionData) => {
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar',
        allowedContent: true
    });
    const updateToolbarConfiguration = editorApi.registerToolbar({
        components: [
            {
                type: 'Button',
                options: {
                    icon: 'bold',
                    isActive: () => false,
                    isEnabled: () => true,
                    onClick: createSignal(
                        () => console.log('Hello World!')
                    )
                }
            }
        ]
    });
    const handleUserInteraction = event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            const selectionData = getSelectionData(editor);

            if (selectionData) {
                const {left, top} = selectionData.region;

                editorApi.setToolbarPosition(left, top);

                if (selectionData.isEmpty) {
                    editorApi.hideToolbar();
                } else {
                    editorApi.showToolbar(editor.name);
                    updateToolbarConfiguration();
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
