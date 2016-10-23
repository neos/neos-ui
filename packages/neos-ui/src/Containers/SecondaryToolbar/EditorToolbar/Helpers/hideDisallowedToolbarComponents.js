//
// Used to contextually filter toolbar components
//
export default (enabledFormattingRuleIds, formattingUnderCursor) => componentDefinition => {
    if (componentDefinition.isVisibleWhen) {
        return componentDefinition.isVisibleWhen(enabledFormattingRuleIds, formattingUnderCursor);
    }

    return enabledFormattingRuleIds.indexOf(componentDefinition.formattingRule) !== -1;
};
