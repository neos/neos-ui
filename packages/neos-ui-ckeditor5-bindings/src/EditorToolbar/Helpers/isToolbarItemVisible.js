//
// Used to contextually filter toolbar components
//
export default (inlineEditorOptions, formattingUnderCursor) => componentDefinition => {
    if (componentDefinition.isVisible) {
        return componentDefinition.isVisible(inlineEditorOptions, formattingUnderCursor);
    }
    return false;
};
