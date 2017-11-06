import {$get} from 'plow-js';
//
// Used to contextually filter toolbar components
//
export default (inlineEditorOptions, formattingUnderCursor) => componentDefinition => {
    if (componentDefinition.isVisibleWhen) {
        return componentDefinition.isVisibleWhen(inlineEditorOptions, formattingUnderCursor);
    }

    return Boolean($get(['formatting', componentDefinition.formattingRule], inlineEditorOptions));
};
