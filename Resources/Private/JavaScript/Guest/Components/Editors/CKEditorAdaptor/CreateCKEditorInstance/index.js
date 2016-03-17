export default (ckApi, dom, getSelectionData, toolbar) => {
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar',
        allowedContent: true
    });
    const handleUserInteraction = event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            const selectionData = getSelectionData(editor);

            if (selectionData) {
                toolbar.update({
                    isVisible: !selectionData.isEmpty,
                    position: {
                        x: selectionData.region.left,
                        y: selectionData.region.top
                    }
                });
            }
        }
    };
    const handleEditorBlur = event => {
        event.removeListener('blur', handleEditorBlur);
        event.removeListener('keyup', handleUserInteraction);
        event.removeListener('mouseup', handleUserInteraction);

        handleUserInteraction(event);
        toolbar.update({isVisible: false});
    };
    const handleEditorFocus = event => {
        const editable = editor.editable();

        editable.attachListener(editable, 'blur', handleEditorBlur);
        editable.attachListener(editable, 'keyup', handleUserInteraction);
        editable.attachListener(editable, 'mouseup', handleUserInteraction);

        handleUserInteraction(event);
    };

    editor.once('contentDom', () => {
        const editable = editor.editable();

        editable.attachListener(editable, 'focus', handleEditorFocus);
    });

    return editor;
};
