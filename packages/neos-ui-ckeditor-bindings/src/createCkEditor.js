import {$get} from 'plow-js';

import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

export default ({propertyDomNode, propertyName, contextPath, nodeType, editorOptions, globalRegistry, persistChange}) => {
    const formattingRulesRegistry = globalRegistry.get('ckEditor').get('formattingRules');
    const richtextToolbarRegistry = globalRegistry.get('ckEditor').get('richtextToolbar');
    const i18nRegistry = globalRegistry.get('i18n');
    const enabledFormattingRuleIds = richtextToolbarRegistry
        .getEnabledFormattingRulesForNodeTypeAndProperty(nodeType.name)(propertyName);
    const placeholder = unescape(i18nRegistry.translate($get('placeholder', editorOptions)));
    const isAutoParagraphEnabled = Boolean($get('autoparagraph', editorOptions));

    const ckEditorConfiguration = enabledFormattingRuleIds
        .map(formattingRuleId => formattingRulesRegistry.get(formattingRuleId))
        .reduce((ckEditorConfiguration, formattingDefinition) => {
            const {config} = formattingDefinition;

            if (config) {
                return Object.assign({}, ckEditorConfiguration, config(ckEditorConfiguration));
            }

            return ckEditorConfiguration;
        }, Object.assign(
            {
                extraPlugins: 'neos_placeholder,neos_fixPasteIntoInlineElements',
                removePlugins: 'floatingspace,maximize,resize,contextmenu,liststyle,tabletools',
                autoParagraph: isAutoParagraphEnabled,
                entities: false,
                basicEntities: false
            },
            placeholder ? {neosPlaceholder: placeholder} : {}
        ));

    getGuestFrameWindow().NeosCKEditorApi.createEditor(propertyDomNode, ckEditorConfiguration, propertyName, contents => {
        persistChange({
            type: 'Neos.Neos.Ui:Property',
            subject: contextPath,
            payload: {
                propertyName,
                value: contents
            }
        });
    });
};
