import {memoize} from 'ramda';
import {$get} from 'plow-js';

const inlineEditable = properties => propertyName =>
    $get([propertyName, 'ui', 'inlineEditable'], properties);

const createAlohaConfigPostProcessor = formattingRulesRegistry => alohaConfiguration => {
    const keysToParse = ['format', 'link', 'list', 'table'];

    const enabledFormattingRuleIds = [];
    if (alohaConfiguration) {
        keysToParse.forEach(key => {
            if (alohaConfiguration[key] && alohaConfiguration[key].filter) { // TODO: support object-based aloha configuration
                alohaConfiguration[key]
                    .filter(formattingRuleId => formattingRulesRegistry.has(formattingRuleId))
                    .forEach(formattingRuleId =>
                        enabledFormattingRuleIds.push(formattingRuleId)
                    );
            }
        });
    }

    return enabledFormattingRuleIds;
};

export default ({nodeTypesRegistry, formattingRulesRegistry}) => {
    const postProcessAlohaConfig = createAlohaConfigPostProcessor(formattingRulesRegistry);

    return memoize(nodeTypeName => {
        const {properties} = nodeTypesRegistry.get(nodeTypeName);

        const enabledFormattingRules = {};
        Object.keys(properties)
            .filter(inlineEditable(properties))
            .forEach(propertyName => {
                const property = properties[propertyName];
                enabledFormattingRules[propertyName] = postProcessAlohaConfig($get('ui.aloha', property));
            });

        return enabledFormattingRules;
    });
};
