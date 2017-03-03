import {$get} from 'plow-js';

import calculateEnabledFormattingRulesForNodeTypeFactory from './calculateEnabledFormattingRulesForNodeType';
import * as dom from './dom';

import style from '../style.css';

export default function initializeCkEditorForDomNode(domNode, dependencies) {
    const {byContextPathDynamicAccess, globalRegistry, persistChange} = dependencies;

    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const formattingRulesRegistry = globalRegistry.get('ckEditor').get('formattingRules');
    const i18nRegistry = globalRegistry.get('i18n');

    const calculateEnabledFormattingRulesForNodeType = calculateEnabledFormattingRulesForNodeTypeFactory(globalRegistry);

    const editors = domNode.querySelectorAll('.neos-inline-editable');
    Array.prototype.forEach.call(editors, domNode => {
        const contextPath = dom.closestContextPath(domNode);
        const propertyName = domNode.dataset.__neosProperty;

        const node = byContextPathDynamicAccess(contextPath);

        if (!node) {
            console.warn('No node found at path: ' + contextPath);
            return;
        }

        domNode.classList.add(style.editable);

        const nodeFormattingRules = calculateEnabledFormattingRulesForNodeType($get('nodeType', node));
        const placeholderLabel = $get(['properties', propertyName, 'ui', 'aloha', 'placeholder'], nodeTypesRegistry.get($get('nodeType', node)));
        const placeholder = unescape(i18nRegistry.translate(placeholderLabel));

        const enabledFormattingRuleIds = nodeFormattingRules[propertyName] || [];

        // Build up editor config for each enabled formatting
        let editorOptions = Object.assign(
            {
                extraPlugins: 'confighelper',
                removePlugins: 'floatingspace,maximize,resize,toolbar,contextmenu,liststyle,tabletools'
            },
            placeholder ? {placeholder} : {}
        );

        enabledFormattingRuleIds.forEach(formattingRuleId => {
            const formattingDefinition = formattingRulesRegistry.get(formattingRuleId);

            if (formattingDefinition.config) {
                editorOptions = formattingDefinition.config(editorOptions);
            }
        });

        dom.iframeWindow().NeosCKEditorApi.createEditor(domNode, editorOptions, propertyName, contents => {
            persistChange({
                type: 'Neos.Neos.Ui:Property',
                subject: contextPath,
                payload: {
                    propertyName,
                    value: contents
                }
            });
        });
    });
}
