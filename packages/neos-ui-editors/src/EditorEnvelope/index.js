import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import omit from 'lodash.omit';

import Label from '@neos-project/react-ui-components/src/Label/';
import {Tooltip} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

import {Icon} from '@neos-project/react-ui-components';

@neos(globalRegistry => ({
    editorRegistry: globalRegistry.get('inspector').get('editors'),
    i18nRegistry: globalRegistry.get('i18n')
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
        i18nRegistry: PropTypes.object.isRequired,
        validationErrors: PropTypes.array,
        onEnterKey: PropTypes.func,
        helpMessage: PropTypes.string,
        helpThumbnail: PropTypes.string,
        highlight: PropTypes.bool,

        commit: PropTypes.func.isRequired
    };

    generateIdentifier() {
        return `__neos__editor__property---${this.props.identifier}`;
    }

    getEditorDefinition() {
        const {editor, editorRegistry} = this.props;
        // Support legacy editor definitions
        const editorName = editor.replace('Content/Inspector/Editors', 'Neos.Neos/Inspector/Editors');
        return editorRegistry.get(editorName);
    }

    isInvalid() {
        const {validationErrors} = this.props;
        return validationErrors && validationErrors.length > 0;
    }

    renderEditorComponent() {
        const editorDefinition = this.getEditorDefinition();

        if (editorDefinition && editorDefinition.component) {
            const EditorComponent = editorDefinition && editorDefinition.component;

            const {highlight} = this.props;
            const restProps = omit(this.props, ['validationErrors']);

            // We pass down a classname to render a highlight status on the editor field
            const classNames = mergeClassNames({
                [style['envelope--highlight']]: highlight && !this.isInvalid(),
                [style['envelope--invalid']]: this.isInvalid()
            });

            return (
                <EditorComponent className={classNames}
                    id={this.generateIdentifier()}
                    renderHelpIcon={this.renderHelpIcon}
                    {...restProps} />
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

    getThumbnailSrc(thumbnail) {
        if (thumbnail.substr(0, 11) === 'resource://') {
            thumbnail = '/_Resources/Static/Packages/' + thumbnail.substr(11);
        }

        return thumbnail;
    }

    renderHelpmessage() {
        const {i18nRegistry, helpMessage, helpThumbnail, label} = this.props;

        const translatedHelpMessage = i18nRegistry.translate(helpMessage);
        const helpThumbnailSrc = this.getThumbnailSrc(helpThumbnail);

        return (
            <Tooltip renderInline className={style.envelope__helpmessage}>
                {helpMessage ? <ReactMarkdown source={translatedHelpMessage} /> : ''}
                {helpThumbnail ? <img alt={label} src={helpThumbnailSrc} className={style.envelope__helpThumbnail} /> : ''}
            </Tooltip>
        );
    }

    renderHelpIcon = () => {
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
                </span>
                {this.renderEditorComponent()}
                {this.state.showHelpmessage ? this.renderHelpmessage() : ''}
                {this.isInvalid() && <Tooltip renderInline asError><ul>{validationErrors.map((error, index) => <li key={index}>{error}</li>)}</ul></Tooltip>}
            </Fragment>
        );
    }
}
