//
// Used to contextually filter toolbar components
//
export default (formattingUnderCursor, inlineEditorOptions) => componentDefinition => {
    if (componentDefinition.isActive) {
        return componentDefinition.isActive(formattingUnderCursor, inlineEditorOptions);
    }
    return false;
};
