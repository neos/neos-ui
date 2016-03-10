import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {CR, UI} from 'Host/Selectors/';
import {Label, TextInput, I18n, Editors} from 'Host/Components/';
import {actions} from 'Host/Redux/';

const resolveEditor = (legacyEditorName) => {
    // TODO: here, the new functionality should also be implemented for extension of editors
    switch (legacyEditorName) {
        case 'TYPO3.Neos/Inspector/Editors/TextFieldEditor':
            return Editors.TextField;
        case 'TYPO3.Neos/Inspector/Editors/BooleanEditor':
            return Editors.Boolean;
        case 'TYPO3.Neos/Inspector/Editors/DateTimeEditor':
            return Editors.DateTime;
        case 'TYPO3.Neos/Inspector/Editors/SelectBoxEditor':
            return Editors.SelectBox;
        case 'TYPO3.Neos/Inspector/Editors/ImageEditor':
            return Editors.Image;
        case 'TYPO3.Neos/Inspector/Editors/TextAreaEditor':
            return Editors.TextArea;
        case 'Content/Inspector/Editors/NodeTypeEditor':
            return Editors.NodeType;

        default:
            console.error(`ERROR: ${legacyEditorName} is not implemented`);
    }
};


@connect($transform({
    focusedNode: CR.Nodes.focusedSelector,
    currentInspectorValue: UI.Inspector.currentValue
}), {
    writeValue: actions.UI.Inspector.writeValue
})
export default class SingleInspectorEditor extends Component {

    static propTypes = {
        property: PropTypes.object.isRequired,
        currentInspectorValue: PropTypes.func.isRequired,
        writeValue: PropTypes.func.isRequired
    };

    constructor() {
        super(...arguments);
        this.changeFn = value =>
            this.props.writeValue(this.props.focusedNode.contextPath, this.props.property.id, value);
    }

    render() {
        const {currentInspectorValue, property} = this.props;
        const Editor = resolveEditor(property.ui.inspector.editor);
        const value = currentInspectorValue(property.id);

        if (Editor) {
            return (<Editor value={value} onChange={this.changeFn} />);
        } else {
            return (<div>NOT EXISTING</div>);
        }
    }
}
