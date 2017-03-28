import {memoize} from 'ramda';

export default formattingRulesRegistry => memoize(
    editorOptions => [].concat(
        ...['format', 'link', 'list', 'table']
            .map(configurationKey => editorOptions[configurationKey])
            .filter(i => i)
    ).filter(formattingRuleId => formattingRulesRegistry.has(formattingRuleId))
);
