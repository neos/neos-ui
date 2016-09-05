import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import registry from 'Host/Extensibility/Registry/index';
import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import {selectors} from 'Host/Redux/index';

// Predicate matching all "element.id"s starting with "prefix".
const startsWith = prefix => element =>
    element.id.indexOf(prefix) === 0;

/**
 * The Actual StyleSelect component
 */
@connect($transform({
    activeFormatting: $get('ui.contentCanvas.activeFormatting'),
    context: selectors.Guest.context
}))
export default class StyleSelect extends Component {

    static propTypes = {
        // the Registry ID/Key of the Style-Select component itself.
        id: PropTypes.string.isRequired,

        activeFormatting: PropTypes.objectOf(React.PropTypes.bool),

        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(...args) {
        super(...args);
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    handleOnSelect(selectedStyleId) {
        const style = registry.ckEditor.toolbar.get(selectedStyleId);
        this.props.context.NeosCKEditorApi.toggleFormat(style.formatting);
    }

    render() {
        const nestedStyles = registry.ckEditor.toolbar.getAllAsList().filter(startsWith(`${this.props.id}/`));

        const options = nestedStyles.map(style => ({
            label: style.label,
            value: style.id
        }));

        const selectedStyle = nestedStyles.find(style =>
            $get(style.formatting, this.props.activeFormatting)
        );

        return <SelectBox options={options} value={selectedStyle ? selectedStyle.id : null} onSelect={this.handleOnSelect}/>;
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

}
