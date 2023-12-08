import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import LinkInput from '@neos-project/neos-ui-editors/src/Library/LinkInput';

import {IconButton} from '@neos-project/react-ui-components';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';

import style from './LinkButton.module.css';

@connect(state => ({
    isOpen: selectors.UI.ContentCanvas.isLinkEditorOpen(state)
}), {
    toggle: actions.UI.ContentCanvas.toggleLinkEditor
})
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
        executeCommand: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired
    };

    handleLinkButtonClick = () => {
        if (this.props.isOpen) {
            if (this.props.formattingUnderCursor?.link !== undefined) {
                // We need to remove all attributes before unsetting the link
                this.props.executeCommand('linkTitle', false, false);
                this.props.executeCommand('linkRelNofollow', false, false);
                this.props.executeCommand('linkTargetBlank', false, false);
                this.props.executeCommand('linkDownload', false, false);
                this.props.executeCommand('unlink');
            }
            this.props.toggle(false);
        } else {
            this.props.toggle(true);
        }
    }

    handleLinkChange = value => {
        if (value === '') {
            this.props.executeCommand('unlink');
        } else {
            this.props.executeCommand('link', value, false);
        }
    }

    handleLinkTitleChange = value => {
        this.props.executeCommand('linkTitle', value, false);
    }

    handleLinkTargetChange = () => {
        this.props.executeCommand('linkTargetBlank', undefined, false);
    }

    handleLinkRelChange = () => {
        this.props.executeCommand('linkRelNofollow', undefined, false);
    }

    handleLinkDownloadChange = () => {
        this.props.executeCommand('linkDownload', undefined, false);
    }

    render() {
        const {i18nRegistry, inlineEditorOptions, isOpen} = this.props;

        return (
            <div>
                <IconButton
                    title={this.getLinkValue() ? `${i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__unlink', 'Unlink')}` : `${i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link', 'Link')}`}
                    isActive={isOpen}
                    icon={this.getLinkValue() ? 'unlink' : 'link'}
                    onClick={this.handleLinkButtonClick}
                />
                {isOpen ? (
                    <div className={style.linkButton__flyout}>
                        <LinkInput
                            linkingOptions={inlineEditorOptions?.linking}
                            linkValue={this.getLinkValue()}
                            linkTitleValue={this.getLinkTitleValue()}
                            linkRelNofollowValue={this.getLinkRelValue()}
                            linkTargetBlankValue={this.getLinkTargetValue()}
                            linkDownloadValue={this.getLinkDownloadValue()}
                            onLinkChange={this.handleLinkChange}
                            onLinkTitleChange={this.handleLinkTitleChange}
                            onLinkRelChange={this.handleLinkRelChange}
                            onLinkTargetChange={this.handleLinkTargetChange}
                            onLinkDownloadChange={this.handleLinkDownloadChange}
                            setFocus={true}
                        />
                    </div>
                ) : null}
            </div>
        );
    }

    getLinkValue() {
        return this.props.formattingUnderCursor?.link || '';
    }

    getLinkTitleValue() {
        return this.props.formattingUnderCursor?.linkTitle || '';
    }

    getLinkRelValue() {
        return this.props.formattingUnderCursor?.linkRelNofollow || false;
    }

    getLinkTargetValue() {
        return this.props.formattingUnderCursor?.linkTargetBlank || false;
    }

    getLinkDownloadValue() {
        return this.props.formattingUnderCursor?.linkDownload || false;
    }
}
