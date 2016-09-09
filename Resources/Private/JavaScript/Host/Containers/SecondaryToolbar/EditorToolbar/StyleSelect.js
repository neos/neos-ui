import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import registry from 'Host/Extensibility/Registry/index';
import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import {selectors} from 'Host/Redux/index';
import {hideDisallowedToolbarComponents} from './index';

// Predicate matching all "element.id"s starting with "prefix".
const startsWith = prefix => element =>
    element.id.indexOf(prefix) === 0;

/**
 * The Actual StyleSelect component
 */
@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor,
    enabledFormattingRuleIds: selectors.UI.ContentCanvas.enabledFormattingRuleIds,
    context: selectors.Guest.context
}))
export default class StyleSelect extends Component {

    static propTypes = {
        // the Registry ID/Key of the Style-Select component itself.
        id: PropTypes.string.isRequired,

        formattingUnderCursor: PropTypes.objectOf(React.PropTypes.bool),
        enabledFormattingRuleIds: PropTypes.arrayOf(PropTypes.string),

        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(...args) {
        super(...args);
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    handleOnSelect(selectedStyleId) {
        const style = registry.ckEditor.toolbar.get(selectedStyleId);
        if (style && style.formattingRule) {
            this.props.context.NeosCKEditorApi.toggleFormat(style.formattingRule);
        } else {
            console.warn('Style formatting not set: ', selectedStyleId, style);
        }
    }

    render() {
        const nestedStyles = registry.ckEditor.toolbar.getAllAsList()
            .filter(startsWith(`${this.props.id}/`))
            .filter(hideDisallowedToolbarComponents(this.props.enabledFormattingRuleIds));

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

        return <SelectBox options={options} value={selectedStyle ? selectedStyle.id : null} onSelect={this.handleOnSelect}/>;
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

}
