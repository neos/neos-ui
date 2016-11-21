import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Label from '@neos-project/react-ui-components/lib/Label/';
import shallowCompare from 'react-addons-shallow-compare';

import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors')
}))
export class InternalEditorEnvelope extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        editor: PropTypes.string.isRequired,
        options: PropTypes.object,
        renderSecondaryInspector: PropTypes.func.isRequired,
        editorRegistry: PropTypes.object.isRequired,

        node: PropTypes.object.isRequired,
        onValueChange: PropTypes.func.isRequired,
        transient: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onHandleCommit = this.onHandleCommit.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
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
            identifier: id,
            label,
            node,
            value: transientValue ? transientValue.value : sourceValue,
            hooks: transientValue ? transientValue.hooks : null,
            propertyName: id,
            options
        };
    }

    renderEditorComponent() {
        const {editor, editorRegistry, renderSecondaryInspector} = this.props;
        const editorDefinition = editorRegistry.get(editor);

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;

            return (
                <EditorComponent
                    {...this.prepareEditorProperties()}
                    commit={this.onHandleCommit}
                    renderSecondaryInspector={renderSecondaryInspector}
                    />
            );
        }

        return (<div>Missing Editor {editor}</div>);
    }

    onHandleCommit(value, hooks = null) {
        const {transient, id, onValueChange} = this.props;

        if ($get([id], transient) === value && hooks === null) {
            //
            // Nothing has changed...
            //
            return onValueChange(id, null, null);
        }

        return onValueChange(id, value, hooks);
    }

    renderLabel() {
        const {editor, editorRegistry} = this.props;
        const editorDefinition = editorRegistry.get(editor);

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

/**
 * (Stateful) Editor envelope
 *
 * For reference on how to use editors, check the docs inside the Registry.
 */
const EditorEnvelope = connect($transform({
    node: selectors.CR.Nodes.focusedSelector,
    transient: selectors.UI.Inspector.transientValues
}), {
    onValueChange: actions.UI.Inspector.commit
})(InternalEditorEnvelope);

export default EditorEnvelope;
