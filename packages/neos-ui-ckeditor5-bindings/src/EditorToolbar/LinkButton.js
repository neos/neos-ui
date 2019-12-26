import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import LinkInput from '@neos-project/neos-ui-editors/src/Library/LinkInput';

import {IconButton} from '@neos-project/react-ui-components';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './LinkButton.css';

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
        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        isOpen: false
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if new selection doesn't have a link, close the link dialog
        if (!$get('link', nextProps.formattingUnderCursor)) {
            this.setState({isOpen: false});
        }
    }

    handleLinkButtonClick = () => {
        if (this.isOpen()) {
            if ($get('link', this.props.formattingUnderCursor) !== undefined) {
                // We need to remove all attirbutes before unsetting the link
                this.props.executeCommand('linkTitle', false, false);
                this.props.executeCommand('linkRelNofollow', false, false);
                this.props.executeCommand('linkTargetBlank', false, false);
                this.props.executeCommand('unlink');
            }
            this.setState({isOpen: false});
        } else {
            this.setState({isOpen: true});
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
