import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import {IconButton, SelectBox, Icon, CheckBox, TextInput} from '@neos-project/react-ui-components';
import LinkOption from '@neos-project/neos-ui-editors/src/Library/LinkOption';
import {neos} from '@neos-project/neos-ui-decorators';
import {executeCommand} from './../ckEditorApi';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {isUri} from '@neos-project/utils-helpers';

import style from './LinkIconButton.css';

@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class LinkIconButton extends PureComponent {
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

    handleLinkButtonClick = () => {
        if (this.isOpen()) {
            // We need to remove all attirbutes before unsetting the link
            executeCommand('linkTitle', false, false);
            executeCommand('linkRelNofollow', false, false);
            executeCommand('linkTargetBlank', false, false);
            executeCommand('unlink');
        } else {
            executeCommand('link', '', false);
        }
    }

    render() {
        const {i18nRegistry, isActive, formattingUnderCursor, inlineEditorOptions} = this.props;

        return (
            <div>
                <IconButton
                    title={`${i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link')}`}
                    isActive={isActive}
                    icon="link"
                    onClick={this.handleLinkButtonClick}
                    />
                {this.isOpen() ? <LinkTextField hrefValue={this.getHrefValue()} formattingUnderCursor={formattingUnderCursor} inlineEditorOptions={inlineEditorOptions} /> : null}
            </div>
        );
    }

    isOpen() {
        return this.getHrefValue() === '' || this.getHrefValue();
    }

    getHrefValue() {
        return $get('link', this.props.formattingUnderCursor);
    }
}

const isUriOrInternalLink = link => Boolean(isUri(link) || link.indexOf('node://') === 0 || link.indexOf('asset://') === 0);
const isInternalLink = link => Boolean(link.indexOf('node://') === 0 || link.indexOf('asset://') === 0);

@neos(globalRegistry => ({
    linkLookupDataLoader: globalRegistry.get('dataLoaders').get('LinkLookup'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
class LinkTextField extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object,
        hrefValue: PropTypes.string,
        inlineEditorOptions: PropTypes.object,

        linkLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        contextForNodeLinking: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired
    };

    state = {
        isEditMode: false,
        searchTerm: '',
        isLoading: false,
        searchOptions: [],
        options: [],
        optionsPanelIsOpen: false
    };

    getDataLoaderOptions() {
        return {
            nodeTypes: ['Neos.Neos:Document'],
            contextForNodeLinking: this.props.contextForNodeLinking.toJS()
        };
    }

    componentDidMount() {
        this.refreshState();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.hrefValue !== this.props.hrefValue) {
            this.refreshState();
        }
    }

    refreshState() {
        if (this.props.hrefValue) {
            if (isInternalLink(this.props.hrefValue)) {
                this.setState({
                    isLoading: true,
                    isEditMode: false
                });
                this.props.linkLookupDataLoader.resolveValue(this.getDataLoaderOptions(), this.props.hrefValue.split('#')[0])
                    .then(options => {
                        this.setState({
                            isLoading: false,
                            options
                        });
                    });
            } else {
                this.setState({
                    isEditMode: false,
                    options: []
                });
            }
        } else {
            this.setState({
                isEditMode: true,
                searchTerm: ''
            });
        }
    }

    commitValue = value => executeCommand('link', value, false);

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        if (isUriOrInternalLink(searchTerm)) {
            this.setState({
                isLoading: false,
                searchOptions: []
            });
        } else if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.linkLookupDataLoader.search(this.getDataLoaderOptions(), searchTerm)
                .then(searchOptions => {
                    this.setState({
                        isLoading: false,
                        searchOptions
                    });
                });
        }
    }

    handleSearchTermKeyPress = e => {
        if (e && e.key === 'Enter') {
            this.handleManualSetLink();
        }
    }

    // A node has been selected
    handleValueChange = value => {
        this.commitValue(value || '');

        if (isInternalLink(value)) {
            const options = this.state.searchOptions.reduce((current, option) =>
                    (option.loaderUri === value) ? [Object.assign({}, option)] : current
                , []);

            this.setState({
                options,
                searchOptions: [],
                searchTerm: '',
                isEditMode: false
            });
        }
    }

    handleManualSetLink = () => {
        this.commitValue(this.state.searchTerm);
        this.setState({
            isEditMode: false
        });
    }

    handleSwitchToEditMode = () => {
        this.setState({
            isEditMode: true,
            searchTerm: this.props.hrefValue
        });
    }

    handleToggleOptionsPanel = () => {
        this.setState({
            optionsPanelIsOpen: !this.state.optionsPanelIsOpen
        });
    }

    renderEditMode() {
        return (
            <Fragment>
                <SelectBox
                    options={this.state.searchOptions}
                    optionValueField="loaderUri"
                    value={''}
                    plainInputMode={isUri(this.state.searchTerm)}
                    onValueChange={this.handleValueChange}
                    placeholder={this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__placeholder', 'Paste a link, or search')}
                    displayLoadingIndicator={this.state.isLoading}
                    displaySearchBox={true}
                    setFocus={!this.props.hrefValue}
                    showDropDownToggle={false}
                    allowEmpty={true}
                    searchTerm={this.state.searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    onSearchTermKeyPress={this.handleSearchTermKeyPress}
                    ListPreviewElement={LinkOption}
                    noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                    searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                />
                <IconButton
                    className={style.linkIconButton__innerButton}
                    icon="check"
                    onClick={this.handleManualSetLink}
                    />
            </Fragment>
        );
    }

    renderViewMode() {
        return (
            <Fragment>
                <div style={{flexGrow: 1}} onClick={this.handleSwitchToEditMode} role="button">
                    {this.state.isLoading ? <Icon icon="spinner" className={style.linkIconButton__loader} spin={true} size="lg" /> : (
                        // if options then it's an asset or node, otherwise a plain link
                        this.state.options[0] ? (
                            <LinkOption option={this.state.options[0]} />
                        ) : (
                            <LinkOption option={{
                                icon: 'external-link-alt',
                                label: this.props.hrefValue,
                                loaderUri: this.props.hrefValue
                            }} />
                        )
                    )}
                </div>
                <IconButton
                    className={style.linkIconButton__innerButton}
                    icon="pencil-alt"
                    onClick={this.handleSwitchToEditMode}
                    />
            </Fragment>
        );
    }

    renderOptionsPanel() {
        return (
            <div className={style.linkIconButton__optionsPanel}>
                {$get('linking.anchor', this.props.inlineEditorOptions) && (
                    <div className={style.linkIconButton__optionsPanelItem}>
                        <label className={style.linkIconButton__optionsPanelLabel} htmlFor="__neos__linkEditor--anchor">
                            {this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__anchor', 'Link to anchor')}
                        </label>
                        <div>
                            <TextInput
                                id="__neos__linkEditor--anchor"
                                value={$get('link', this.props.formattingUnderCursor).split('#')[1] || ''}
                                placeholder={this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__anchorPlaceholder', 'Enter anchor name')}
                                onChange={value => {
                                    executeCommand('link', $get('link', this.props.formattingUnderCursor).split('#')[0] + '#' + value, false);
                                }}
                                />
                        </div>
                    </div>)}
                {$get('linking.title', this.props.inlineEditorOptions) && (
                    <div className={style.linkIconButton__optionsPanelItem}>
                        <label className={style.linkIconButton__optionsPanelLabel} htmlFor="__neos__linkEditor--title">
                            {this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__title', 'Title')}
                        </label>
                        <div>
                            <TextInput
                                id="__neos__linkEditor--title"
                                value={$get('linkTitle', this.props.formattingUnderCursor) || ''}
                                placeholder={this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__titlePlaceholder', 'Enter link title')}
                                onChange={value => {
                                    executeCommand('linkTitle', value, false);
                                }}
                                />
                        </div>
                    </div>)}
                <div className={style.linkIconButton__optionsPanelDouble}>
                    {$get('linking.targetBlank', this.props.inlineEditorOptions) && (
                        <div className={style.linkIconButton__optionsPanelItem}>
                            <label>
                                <CheckBox
                                    onChange={() => {
                                        executeCommand('linkTargetBlank', undefined, false);
                                    }}
                                    isChecked={$get('linkTargetBlank', this.props.formattingUnderCursor) || false}
                                /> {this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__targetBlank', 'Open in new window')}
                            </label>
                        </div>)}
                    {$get('linking.relNofollow', this.props.inlineEditorOptions) && (
                        <div className={style.linkIconButton__optionsPanelItem}>
                            <label>
                                <CheckBox
                                    onChange={() => {
                                        executeCommand('linkRelNofollow', undefined, false);
                                    }}
                                    isChecked={$get('linkRelNofollow', this.props.formattingUnderCursor) || false}
                                /> {this.props.i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link__noFollow', 'No follow')}
                            </label>
                        </div>)}
                </div>
            </div>
        );
    }

    render() {
        const linkingOptions = $get('linking', this.props.inlineEditorOptions);
        const optionsPanelEnabled = Boolean(linkingOptions && Object.values(linkingOptions).filter(i => i).length);
        return (
            <div className={style.linkIconButton__flyout}>
                <div className={style.linkIconButton__wrap}>
                    {this.state.isEditMode ? this.renderEditMode() : this.renderViewMode()}
                    {optionsPanelEnabled && (
                        <IconButton
                            onClick={this.handleToggleOptionsPanel}
                            style={this.state.optionsPanelIsOpen ? 'brand' : 'transparent'}
                            className={style.linkIconButton__innerButton}
                            icon="ellipsis-v"
                            />
                    )}
                </div>
                {this.state.optionsPanelIsOpen && this.renderOptionsPanel()}
            </div>
        );
    }
}
