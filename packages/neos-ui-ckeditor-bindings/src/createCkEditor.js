import {$get} from 'plow-js';

import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

export default ({propertyDomNode, propertyName, contextPath, editorOptions, globalRegistry, userPreferences, persistChange}) => {
    const formattingRulesRegistry = globalRegistry.get('ckEditor').get('formattingRules');
    const pluginsRegistry = globalRegistry.get('ckEditor').get('plugins');
    const i18nRegistry = globalRegistry.get('i18n');
    const formattingEditorOptions = $get('formatting', editorOptions);
    const placeholder = unescape(i18nRegistry.translate($get('placeholder', editorOptions)));
    const isAutoParagraphEnabled = Boolean($get('autoparagraph', editorOptions));
    const interfaceLanguage = String($get('interfaceLanguage', userPreferences));

    const ckEditorConfiguration = Object.entries(formattingEditorOptions || {})
        .reduce((ckEditorConfiguration, [formattingRuleId, isFormattingRuleEnabled]) => {
            if (isFormattingRuleEnabled) {
                const formattingDefinition = formattingRulesRegistry.get(formattingRuleId);
                const {config} = formattingDefinition;

                if (config) {
                    ckEditorConfiguration = Object.assign({}, ckEditorConfiguration, config(ckEditorConfiguration, formattingEditorOptions[formattingRuleId]));
                }
            }

            return ckEditorConfiguration;
        }, Object.assign(
            {
                skin: 'neos-build',
                extraPlugins: pluginsRegistry.getExtraPluginsString(),
                removePlugins: 'floatingspace,maximize,resize,liststyle',
                autoParagraph: isAutoParagraphEnabled,
                entities: false,
                basicEntities: true,
                title: propertyName,
                language: interfaceLanguage
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
