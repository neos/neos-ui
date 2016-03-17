export default editor => {
    const selection = editor.getSelection();
    const nativeSelection = selection.getNative();

    if (nativeSelection) {
        const element = selection.getSelectedElement();
        const text = selection.getSelectedText();

        return {element, text};
    }

    return null;
};
