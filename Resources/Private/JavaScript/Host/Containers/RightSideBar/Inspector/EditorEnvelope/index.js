import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {Label} from 'Components/index';
import {I18n} from 'Host/Containers/index';
import neos from 'Host/Decorators/Neos/index';
import {UI} from 'Host/Selectors/index';
import {actions} from 'Host/Redux/index';

const LOAD_PENDING = 1;
const LOAD_SUCCESS = 2;
const LOAD_ERROR = 3;

/**
 * (Stateful) Editor envelope
 *
 * It will wait until the editor is loaded and render it afterwards
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

        node: PropTypes.object.isRequired,
        inspectorEditorRegistry: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    state = {
        EditorComponent: null,
        loadingState: LOAD_PENDING
    };

    componentDidMount() {
        const {editor} = this.props;

        this.loadEditor(editor);
    }

    componentWillReceiveProps(nextProps) {
        const {editor} = nextProps;

        if (editor !== this.props.editor) {
            this.loadEditor(editor);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {node, transient, id} = nextProps;
        const {loadingState} = nextState;

        if (loadingState !== this.state.loadingState) {
            return true;
        }

        if (!Boolean(transient) && !Boolean(this.props.transient)) {
            return false;
        }

        if (Boolean(transient) !== Boolean(this.props.transient)) {
            return true;
        }


        if (!Boolean(transient.get(id)) && !Boolean(this.props.transient.get(id))) {
            return false;
        }

        if (Boolean(transient.get(id)) !== Boolean(this.props.transient.get(id))) {
            return true;
        }

        return (
            node.contextPath != this.props.node.contextPath,
            transient
                .get(id)
                .get('value') !=
            this.props.transient
                .get(id)
                .get('value')
        );
    }

    loadEditor(identifier) {
        const {inspectorEditorRegistry} = this.props;

        this.setState({loadingState: LOAD_PENDING});
        inspectorEditorRegistry.get(identifier)
            .then(EditorComponent => this.setState({EditorComponent, loadingState: LOAD_SUCCESS}))
            .catch(err => console.error(err) || this.setState({loadingState: LOAD_ERROR}));
    }

    generateIdentifier() {
        const {id} = this.state;
        return `#__neos__inspector__property---${id}`;
    }

    prepareEditorProperties() {
        const {label, node, id, transient} = this.props;
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
            identifier: this.generateIdentifier()
        };
    }

    renderEditorComponent() {
        const {loadingState} = this.state;

        if (loadingState === LOAD_ERROR) {
            return (<div>An error occurred</div>);
        }

        if (loadingState === LOAD_PENDING) {
            return (<div>Loading...</div>);
        }

        const {EditorComponent} = this.state;
        const {transient, id, commit} = this.props;

        if (EditorComponent) {
            return (
                <EditorComponent
                    {...this.prepareEditorProperties()}
                    commit={(value, hooks = null) => {
                        if ($get([id], transient) === value && hooks === null) {
                            //
                            // Nothing has changed...
                            //
                            return commit(id, null, null);
                        }

                        return commit(id, value, hooks);
                    }}
                    />
            );
        }

        return (<div>Missing Editor</div>);
    }

    renderLabel() {
        const {EditorComponent} = this.state;

        if (EditorComponent && EditorComponent.hasOwnLabel) {
            return null;
        }

        const {label} = this.props;

        return (
            <Label htmlFor={this.generateIdentifier()}>
                <I18n id={label} />
            </Label>
        )
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
