import React, {PureComponent, PropTypes} from 'react';
import Label from '@neos-project/react-ui-components/lib/Label/';
import I18n, {i18nService} from '@neos-project/neos-ui-i18n';
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
        translations: PropTypes.object.isRequired,
        validationErrors: PropTypes.array,

        commit: PropTypes.func.isRequired
    };

    generateIdentifier() {
        return `#__neos__editor__property---${this.props.identifier}`;
    }

    renderEditorComponent() {
        const {editor, editorRegistry, translations} = this.props;
        const editorDefinition = editorRegistry.get(editor);

        const translate = i18nService(translations);

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;

            return (
                <EditorComponent
                    {...this.props}
                    translate={translate}
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
