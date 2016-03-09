import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {CR} from 'Host/Selectors/';
import {Label, TextInput, I18n, Editors} from 'Host/Components/';


const resolveEditor = (legacyEditorName) => {
    // TODO: here, the new functionality should also be implemented for extension of editors
    switch (legacyEditorName) {
        case 'TYPO3.Neos/Inspector/Editors/TextFieldEditor':
            return Editors.TextField;
        default:
            console.error(`ERROR: ${legacyEditorName} is not implemented`);
    }
}


@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class SingleInspectorEditor extends Component {

    static propTypes = {
        property: PropTypes.object.isRequired,
        focusedNode: PropTypes.object.isRequired
    };

    render() {
        const Editor = resolveEditor(this.props.property.ui.inspector.editor);

        if (Editor) {
            return (<Editor value={this.props.focusedNode.properties[this.props.property.id]}/>);
        } else {
            return (<div>NOT EXISTING</div>);
        }
        //console.log(this.props.property);
        //resolveEditor(property)
        //return (<TextInput placeholder="Type to search" id="testInput"  />);
    }
}
