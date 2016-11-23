import React, {Component, PropTypes} from 'react';
import Label from '@neos-project/react-ui-components/lib/Label/';
import shallowCompare from 'react-addons-shallow-compare';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors')
}))
export default class EditorEnvelope extends Component {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        editor: PropTypes.string.isRequired,
        options: PropTypes.object,
        renderSecondaryInspector: PropTypes.func,
        editorRegistry: PropTypes.object.isRequired,

        commit: PropTypes.func.isRequired,
        transient: PropTypes.object
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
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
                    />
            );
        }

        return (<div>Missing Editor {editor}</div>);
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
