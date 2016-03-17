export default (ckApi, dom, getSelectionData, toolbar) => {
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar',
        allowedContent: true
    });
    const handleUserInteraction = event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            const selectionData = getSelectionData(editor);

            if (selectionData) {
                const update = () => toolbar.update({
                    isVisible: !selectionData.isEmpty,
                    position: {
                        x: selectionData.region.left,
                        y: selectionData.region.top
                    },
                    buttons: {
                        bold: {
                            type: 'button',
                            props: {
                                icon: 'fa-bold',
                                isActive: editor.getCommand('bold').state === ckApi.TRISTATE_ON,
                                onClick: () => {
                                    editor.execCommand('bold');
                                    update();
                                }
                            }
                        },
                        italic: {
                            type: 'button',
                            props: {
                                icon: 'fa-italic',
                                isActive: editor.getCommand('italic').state === ckApi.TRISTATE_ON,
                                onClick: () => {
                                    editor.execCommand('italic');
                                    update();
                                }
                            }
                        },
                        strikeThrough: {
                            type: 'button',
                            props: {
                                icon: 'fa-strikethrough',
                                isActive: editor.getCommand('strike').state === ckApi.TRISTATE_ON,
                                onClick: () => {
                                    editor.execCommand('strike');
                                    update();
                                }
                            }
                        }
                    }
                });

                update();
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
