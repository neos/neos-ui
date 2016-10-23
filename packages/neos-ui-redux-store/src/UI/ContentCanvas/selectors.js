import {createSelector} from 'reselect';
import {$get} from 'plow-js';

import {selectors as nodes} from '../../CR/Nodes/index';

const inlineEditable = properties => propertyName =>
    $get([propertyName, 'ui', 'inlineEditable'], properties);

//
// TODO: REFACTOR THIS TO FIT WITH THE REGISTY IMPLEMENTATION
//
const postProcessAlohaConfig = alohaConfiguration => {
    const keysToParse = ['format', 'link', 'list', 'table'];

    const enabledFormattingRuleIds = [];
    if (alohaConfiguration) {
        keysToParse.forEach(key => {
            if (alohaConfiguration[key] && alohaConfiguration[key].filter) { // TODO: support object-based aloha configuration
                alohaConfiguration[key]
                    // This doesn't work anymore:
                    //.filter(formattingRuleId => globalRegistry.get('ckEditor').get('formattingRules').has(formattingRuleId))
                    .forEach(formattingRuleId =>
                        enabledFormattingRuleIds.push(formattingRuleId)
                    );
            }
        });
    }

    return enabledFormattingRuleIds;
};

export const calculateEnabledFormattingRulesForNode = node => {
    const {properties} = node.nodeType;

    const enabledFormattingRules = {};
    Object.keys(properties)
        .filter(inlineEditable(properties))
        .forEach(propertyName => {
            const property = properties[propertyName];
            enabledFormattingRules[propertyName] = postProcessAlohaConfig($get('ui.aloha', property));
        });

    return enabledFormattingRules;
};

/**
 * This selector creates the following structure:
 * {
 *    property1: [... list of registry.ckEditor.formattingRules IDs which should be enabled for the property ...]
 * }
 */
export const currentlyEditedPropertyName = $get('ui.contentCanvas.currentlyEditedPropertyName');
export const enabledFormattingRuleIds = createSelector(
    [
        nodes.focusedSelector,
        currentlyEditedPropertyName
    ],
    (focusedNode, currentlyEditedPropertyName) =>
        calculateEnabledFormattingRulesForNode(focusedNode)[currentlyEditedPropertyName] || []
);

export const formattingUnderCursor = createSelector(
    [
        $get('ui.contentCanvas.formattingUnderCursor')
    ],
    formattingUnderCursor =>
        formattingUnderCursor.toJS()
);
