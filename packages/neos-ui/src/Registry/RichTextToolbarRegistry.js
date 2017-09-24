import {memoize} from 'ramda';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

export default class RichTextToolbarRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        this.TRISTATE_DISABLED = 0;
        this.TRISTATE_ON = 1;
        this.TRISTATE_OFF = 2;
    }

    hasFormattingRule = formattingRuleId =>
        Object.values(this._registry).some(option => option.formattingRule === formattingRuleId);

    getEnabledFormattingRulesFromEditorOptions = memoize(
        editorOptions => [].concat(
            ...['format', 'link', 'list', 'table', 'alignment']
                .map(configurationKey => editorOptions[configurationKey])
                .filter(i => i)
        ).filter(this.hasFormattingRule)
    );
}
