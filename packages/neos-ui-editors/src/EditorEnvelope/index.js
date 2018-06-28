import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Label from '@neos-project/react-ui-components/src/Label/';
import {Tooltip} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

import {Icon} from '@neos-project/react-ui-components';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors')
}))
export default class EditorEnvelope extends PureComponent {
    state = {
        showTooltip: false
    };

    static defaultProps = {
        helpMessage: '',
        helpThumbnail: ''
    };

    static propTypes = {
        identifier: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        options: PropTypes.object,
        value: PropTypes.any,
        renderSecondaryInspector: PropTypes.func,
        editor: PropTypes.string.isRequired,
        editorRegistry: PropTypes.object.isRequired,
        validationErrors: PropTypes.array,
        onEnterKey: PropTypes.func,
        helpMessage: PropTypes.string,
        helpThumbnail: PropTypes.string,

        commit: PropTypes.func.isRequired
    };

    generateIdentifier() {
        return `#__neos__editor__property---${this.props.identifier}`;
    }

    getEditorDefinition() {
        const {editor, editorRegistry} = this.props;
        // Support legacy editor definitions
        const editorName = editor.replace('Content/Inspector/Editors', 'Neos.Neos/Inspector/Editors');
        return editorRegistry.get(editorName);
    }

    renderEditorComponent() {
        const editorDefinition = this.getEditorDefinition();

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;

            return (
                <EditorComponent
                    {...this.props}
                    id={this.generateIdentifier()}
                    />
            );
        }

        return (<div className={style.envelope__error}>Missing Editor {this.props.editor}</div>);
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
        this.setState({
            error
        });
    }

    renderLabel() {
        const editorDefinition = this.getEditorDefinition();

        if (editorDefinition && editorDefinition.hasOwnLabel) {
            return null;
        }

        const {label} = this.props;

        return (
            <Label className={style.envelope__label} htmlFor={this.generateIdentifier()}>
                <I18n id={label}/>
                {this.renderHelpIcon()}
            </Label>
        );
    }

    toggleTooltip = () => {
        this.setState({
            showTooltip: !this.state.showTooltip
        });
    };

    renderTooltip() {
        return (
            <Tooltip className={style.envelope__tooltip}>
                {this.props.helpMessage ? this.props.helpMessage : ''}
                {this.props.helpThumbnail ? <img src={this.props.helpThumbnail} /> : ''}
            </Tooltip>
        );
    }

    renderHelpIcon() {
        if (this.props.helpMessage || this.props.helpThumbnail) {
            return (
                <span role="button" onClick={this.toggleTooltip} className={style.envelope__tooltipButton}>
                    <Icon icon="question-circle" />
                </span>
            );
        }

        return '';
    }

    render() {
        if (!this.props.editor) {
            return <div className={style.envelope__error}>Missing editor definition</div>;
        }
        if (this.state.error) {
            return <div className={style.envelope__error}>{this.state.error.toString()}</div>;
        }

        return (
            <div>
                <span>
                    {this.renderLabel()}
                    {this.state.showTooltip ? this.renderTooltip() : ''}
                </span>
                {this.renderEditorComponent()}
            </div>
        );
    }
}
