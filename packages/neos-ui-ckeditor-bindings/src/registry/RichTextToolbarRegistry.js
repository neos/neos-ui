import {memoize} from 'ramda';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class RichTextToolbarRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        this.TRISTATE_DISABLED = 0;
        this.TRISTATE_ON = 1;
        this.TRISTATE_OFF = 2;
    }

    setNodeTypesRegistry(nodeTypesRegistry) {
        this.nodeTypesRegistry = nodeTypesRegistry;
    }

    hasFormattingRule = formattingRuleId =>
        Object.values(this._registry).some(option => option.formattingRule === formattingRuleId);

    getEnabledFormattingRulesForNodeTypeAndProperty = memoize(nodeTypeName => memoize(propertyName => {
        const editorOptions = this.nodeTypesRegistry
            .getInlineEditorOptionsForProperty(nodeTypeName, propertyName) || {};

        return [].concat(
            ...['format', 'link', 'list', 'table', 'alignment']
                .map(configurationKey => editorOptions[configurationKey])
                .filter(i => i)
        ).filter(this.hasFormattingRule);
    }));
}
