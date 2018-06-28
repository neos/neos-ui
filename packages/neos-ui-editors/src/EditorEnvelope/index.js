import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';

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
        showHelpmessage: false
    };

    static defaultProps = {
        helpMessage: '',
        helpThumbnail: '',
        highlight: false
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
        highlight: PropTypes.bool,

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

            const restProps = omit(this.props, ['validationErrors', 'highlight']);
            const {highlight, validationErrors} = this.props;
            const isInvalid = validationErrors && validationErrors.length > 1;

            // We pass down a classname to render a highlight status on the editor field
            const classNames = mergeClassNames({
                [style['envelope--highlight']]: highlight && !isInvalid,
                [style['envelope--invalid']]: validationErrors
            });

            return (
                <EditorComponent className={classNames} id={this.generateIdentifier()} {...restProps} />
            );
        }

        return (<div className={style['envelope--invalid']}>Missing Editor {this.props.editor}</div>);
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

    toggleHelmpessage = () => {
        this.setState({
            showHelpmessage: !this.state.showHelpmessage
        });
    };

    renderHelpmessage() {
        const {helpMessage, helpThumbnail, label} = this.props;

        return (
            <Tooltip className={style.envelope__helpmessage}>
                {helpMessage ? helpMessage : ''}
                {helpThumbnail ? <img alt={label} src={helpThumbnail} /> : ''}
            </Tooltip>
        );
    }

    renderHelpIcon() {
        if (this.props.helpMessage || this.props.helpThumbnail) {
            return (
                <span role="button" onClick={this.toggleHelmpessage} className={style.envelope__tooltipButton}>
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

        const {validationErrors} = this.props;

        return (
            <Fragment>
                <span>
                    {this.renderLabel()}
                    {this.state.showHelpmessage ? this.renderHelpmessage() : ''}
                </span>

                {this.renderEditorComponent()}
                {this.props.validationErrors && <Tooltip renderInline asError>{validationErrors}</Tooltip>}
            </Fragment>
        );
    }
}
