import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors')
}))
export default class EditorEnvelope extends PureComponent {
    state = {};

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

    generateIdentifier() {
        return `#__neos__editor__property---${this.props.identifier}`;
    }

    renderEditorComponent() {
        const {editor, editorRegistry} = this.props;
        const editorName = editor.replace('Content/Inspector/Editors', 'Neos.Neos/Inspector/Editors');
        const editorDefinition = editorRegistry.get(editorName);

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;

            return (
                <EditorComponent
                    {...this.props}
                    id={this.generateIdentifier()}
                    />
            );
        }

        return (<div className={style.envelope__error}>Missing Editor {editor}</div>);
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
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
            return <div className={style.envelope__error}>{this.state.error.toString()}</div>;
        }

        return (
            <div>
                {this.renderLabel()}
                {this.renderEditorComponent()}
            </div>
        );
    }
}
