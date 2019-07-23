import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import LinkInput from '@neos-project/neos-ui-editors/src/Library/LinkInput';

import {IconButton} from '@neos-project/react-ui-components';
import {neos} from '@neos-project/neos-ui-decorators';
import {executeCommand} from './../ckEditorApi';

import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './LinkButton.css';

@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class LinkButton extends PureComponent {
    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.string,
            PropTypes.object
        ])),
        inlineEditorOptions: PropTypes.object,
        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        isOpen: false
    };

    componentWillReceiveProps(nextProps) {
        // if new selection doesn't have a link, close the link dialog
        if (!$get('link', nextProps.formattingUnderCursor)) {
            this.setState({isOpen: false});
        }
    }

    handleLinkButtonClick = () => {
        if (this.isOpen()) {
            if ($get('link', this.props.formattingUnderCursor) !== undefined) {
                // We need to remove all attirbutes before unsetting the link
                executeCommand('linkTitle', false, false);
                executeCommand('linkRelNofollow', false, false);
                executeCommand('linkTargetBlank', false, false);
                executeCommand('unlink');
            }
            this.setState({isOpen: false});
        } else {
            this.setState({isOpen: true});
        }
    }

    handleLinkChange = value => {
        if (value === '') {
            executeCommand('unlink');
        } else {
            executeCommand('link', value, false);
        }
    }

    handleLinkTitleChange = value => {
        executeCommand('linkTitle', value, false);
    }

    handleLinkTargetChange = () => {
        executeCommand('linkTargetBlank', undefined, false);
    }

    handleLinkRelChange = () => {
        executeCommand('linkRelNofollow', undefined, false);
    }

    render() {
        const {i18nRegistry, inlineEditorOptions} = this.props;

        return (
            <div>
                <IconButton
                    title={this.getLinkValue() ? `${i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__unlink', 'Unlink')}` : `${i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link', 'Link')}`}
                    isActive={this.isOpen()}
                    icon={this.getLinkValue() ? 'unlink' : 'link'}
                    onClick={this.handleLinkButtonClick}
                    />
                {this.isOpen() ? (
                    <div className={style.linkButton__flyout}>
                        <LinkInput
                            linkingOptions={$get('linking', inlineEditorOptions)}
                            linkValue={this.getLinkValue()}
                            linkTitleValue={this.getLinkTitleValue()}
                            linkRelNofollowValue={this.getLinkRelValue()}
                            linkTargetBlankValue={this.getLinkTargetValue()}
                            onLinkChange={this.handleLinkChange}
                            onLinkTitleChange={this.handleLinkTitleChange}
                            onLinkRelChange={this.handleLinkRelChange}
                            onLinkTargetChange={this.handleLinkTargetChange}
                            setFocus={true}
                            />
                    </div>
                ) : null}
            </div>
        );
    }

    isOpen() {
        return Boolean(this.state.isOpen || this.getLinkValue());
    }

    getLinkValue() {
        return $get('link', this.props.formattingUnderCursor) || '';
    }

    getLinkTitleValue() {
        return $get('linkTitle', this.props.formattingUnderCursor) || '';
    }

    getLinkRelValue() {
        return $get('linkRelNofollow', this.props.formattingUnderCursor) || false;
    }

    getLinkTargetValue() {
        return $get('linkTargetBlank', this.props.formattingUnderCursor) || false;
    }
}
