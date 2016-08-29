import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Label from '@neos-project/react-ui-components/lib/Label/';

import {I18n} from 'Host/Containers/index';
import neos from 'Host/Decorators/Neos/index';
import {UI} from 'Host/Selectors/index';
import registry from 'Host/Extensibility/Registry/index';
import {actions} from 'Host/Redux/index';

/**
 * (Stateful) Editor envelope
 *
 * For reference on how to use editors, check the docs inside the Registry.
 */
@connect($transform({
    node: UI.Inspector.activeNodeSelector,
    transient: UI.Inspector.transientValuesSelector
}), {
    commit: actions.UI.Inspector.commit
})
@neos()
export default class EditorEnvelope extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        editor: PropTypes.string.isRequired,
        options: PropTypes.object,

        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired,
        transient: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onHandleCommit = this.onHandleCommit.bind(this);
    }

    generateIdentifier() {
        return `#__neos__inspector__property---${this.props.id}`;
    }

    prepareEditorProperties() {
        const {label, node, id, transient, options} = this.props;
        const sourceValueRaw = $get(['properties', id], node);
        const sourceValue = sourceValueRaw && sourceValueRaw.toJS ?
            sourceValueRaw.toJS() : sourceValueRaw;
        const transientValueRaw = $get([id], transient);
        const transientValue = transientValueRaw && transientValueRaw.toJS ?
            transientValueRaw.toJS() : transientValueRaw;

        return {
            label,
            node: node.toJS(),
            value: transientValue ? transientValue.value : sourceValue,
            propertyName: id,
            options
        };
    }

    renderEditorComponent() {
        const {editor} = this.props;
        const editorDefinition = registry.inspector.editors.get(editor);

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;
            return (
                <EditorComponent
                    {...this.prepareEditorProperties()}
                    commit={this.onHandleCommit}
                    />
            );
        }

        return (<div>Missing Editor {editor}</div>);
    }

    onHandleCommit(value, hooks = null) {
        const {transient, id, commit} = this.props;

        if ($get([id], transient) === value && hooks === null) {
            //
            // Nothing has changed...
            //
            return commit(id, null, null);
        }

        return commit(id, value, hooks);
    }

    renderLabel() {
        const editorDefinition = registry.inspector.editors.get(this.props.editor);

        if (editorDefinition && editorDefinition.hasOwnLabel) {
            return null;
        }

        const {label} = this.props;

        return (
            <Label htmlFor={this.generateIdentifier()}>
                <I18n id={label}/>
            </Label>
        );
    }

    render() {
        return (
            <div>
                {this.renderLabel()}
                {this.renderEditorComponent()}
            </div>
        );
    }
}
