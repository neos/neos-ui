import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import {hideDisallowedToolbarComponents} from './Helpers';
import {calculateEnabledFormattingRulesForNodeType} from '../../ContentCanvas/Helpers';

// Predicate matching all "element.id"s starting with "prefix".
const startsWith = prefix => element =>
    element.id.indexOf(prefix) === 0;

/**
 * The Actual StyleSelect component
 */
@connect($transform({
    focusedNode: selectors.CR.Nodes.focusedSelector,
    currentlyEditedPropertyName: selectors.UI.ContentCanvas.currentlyEditedPropertyName,
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor,
    context: selectors.Guest.context
}))
@neos(globalRegistry => ({
    toolbarRegistry: globalRegistry.get('richtextToolbar'),
    formattingRulesRegistry: globalRegistry.get('@neos-project/neos-ui-ckeditor-bindings').get('formattingRules'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class StyleSelect extends Component {

    static propTypes = {
        // the Registry ID/Key of the Style-Select component itself.
        id: PropTypes.string.isRequired,

        focusedNode: PropTypes.object,
        currentlyEditedPropertyName: PropTypes.string,
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool
        ])),

        toolbarRegistry: PropTypes.object.isRequired,
        formattingRulesRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,

        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(...args) {
        super(...args);
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    componentWillMount() {
        const {nodeTypesRegistry, formattingRulesRegistry} = this.props;
        this.calculateEnabledFormattingRulesForNodeType = calculateEnabledFormattingRulesForNodeType({
            nodeTypesRegistry,
            formattingRulesRegistry
        });
    }

    handleOnSelect(selectedStyleId) {
        const {toolbarRegistry} = this.props;
        const style = toolbarRegistry.get(selectedStyleId);
        if (style && style.formattingRule) {
            this.props.context.NeosCKEditorApi.toggleFormat(style.formattingRule);
        } else {
            console.warn('Style formatting not set: ', selectedStyleId, style);
        }
    }

    render() {
        const {toolbarRegistry, currentlyEditedPropertyName, focusedNode} = this.props;
        const enabledFormattingRuleIds = this.calculateEnabledFormattingRulesForNodeType(focusedNode.nodeType);
        const nestedStyles = toolbarRegistry.getAllAsList()
            .filter(startsWith(`${this.props.id}/`))
            .filter(hideDisallowedToolbarComponents(enabledFormattingRuleIds[currentlyEditedPropertyName] || []));

        const options = nestedStyles.map(style => ({
            label: style.label,
            value: style.id
        }));

        if (options.length === 0) {
            return null;
        }

        const selectedStyle = nestedStyles.find(style =>
            $get(style.formattingRule, this.props.formattingUnderCursor)
        );

        return (
            <SelectBox
                options={options}
                value={selectedStyle ? selectedStyle.id : null}
                onSelect={this.handleOnSelect}
                />
        );
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

}
