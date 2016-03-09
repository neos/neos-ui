import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {CR} from 'Host/Selectors/';
import {Label, TextInput, I18n, Editors} from 'Host/Components/';
import {actions} from 'Host/Redux/';

const resolveEditor = (legacyEditorName) => {
    // TODO: here, the new functionality should also be implemented for extension of editors
    switch (legacyEditorName) {
        case 'TYPO3.Neos/Inspector/Editors/TextFieldEditor':
            return Editors.TextField;
        default:
            console.error(`ERROR: ${legacyEditorName} is not implemented`);
    }
};


@connect($transform({
    focusedNode: CR.Nodes.focusedSelector,
    inspectorValuesByNodePath: $get('ui.rightSideBar.inspectorValuesByNodePath')
}), {
    inspectorWriteValue: actions.UI.RightSideBar.inspectorWriteValue
})
export default class SingleInspectorEditor extends Component {

    static propTypes = {
        property: PropTypes.object.isRequired,
        focusedNode: PropTypes.object.isRequired,
        inspectorWriteValue: PropTypes.func.isRequired,
        inspectorValuesByNodePath: PropTypes.object.isRequired
    };

    render() {
        const Editor = resolveEditor(this.props.property.ui.inspector.editor);
        const changeFn = value => {
            this.props.inspectorWriteValue(this.props.focusedNode.contextPath, this.props.property.id, value);
        };

        const value = $get([this.props.focusedNode.contextPath, this.props.property.id], this.props.inspectorValuesByNodePath) || this.props.focusedNode.properties[this.props.property.id];

        if (Editor) {
            return (<Editor value={value} onChange={changeFn} />);
        } else {
            return (<div>NOT EXISTING</div>);
        }
    }
}
