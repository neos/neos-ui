import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors')
}))
export default class EditorEnvelope extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        editor: PropTypes.string.isRequired,
        options: PropTypes.object,
        value: PropTypes.any,
        renderSecondaryInspector: PropTypes.func,
        editorRegistry: PropTypes.object.isRequired,
        validationErrors: PropTypes.array,
        onEnterKey: PropTypes.func,

        commit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    generateIdentifier() {
        return `#__neos__editor__property---${this.props.identifier}`;
    }

    renderEditorComponent() {
        const {editor, editorRegistry} = this.props;
        const editorDefinition = editorRegistry.get(editor);

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;

            return (
                <EditorComponent
                    {...this.props}
                    id={this.generateIdentifier()}
                    />
            );
        }

        return (<div>Missing Editor {editor}</div>);
    }

    componentDidCatch(error, errorInfo) {
        console.log(error);
        console.log(errorInfo);
        this.setState({
            error
        });
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
        if (this.state.error) {
            return <div>{this.state.error && this.state.error.toString()}</div>;
        }

        return (
            <div>
                {this.renderLabel()}
                {this.renderEditorComponent()}
            </div>
        );
    }
}
