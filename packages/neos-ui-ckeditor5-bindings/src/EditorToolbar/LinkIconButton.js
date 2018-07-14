import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import {IconButton, SelectBox, Icon} from '@neos-project/react-ui-components';
import LinkOption from './LinkOption';
import {neos} from '@neos-project/neos-ui-decorators';
import {executeCommand} from './../ckEditorApi';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {isUri} from '@neos-project/utils-helpers';

import style from './style.css';

/**
 * The Actual StyleSelect component
 */
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
        i18nRegistry: PropTypes.object.isRequired
    };

    handleLinkButtonClick = () => {
        if (this.isOpen()) {
            executeCommand('unlink');
        } else {
            executeCommand('link', '', false);
        }
    }

    render() {
        const {i18nRegistry, isActive} = this.props;

        return (
            <div>
                <IconButton
                    title={`${i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link')}`}
                    isActive={isActive}
                    icon="link"
                    onClick={this.handleLinkButtonClick}
                    />
                {this.isOpen() ? <LinkTextField hrefValue={this.getHrefValue()} /> : null}
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
        options: []
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

    render() {
        if (this.state.isEditMode) {
            return (
                <div className={style.linkIconButton__flyout}>
                    <SelectBox
                        options={this.state.searchOptions}
                        optionValueField="loaderUri"
                        value={''}
                        plainInputMode={isUri(this.state.searchTerm)}
                        onValueChange={this.handleValueChange}
                        placeholder="Paste a link, or search"
                        displayLoadingIndicator={this.state.isLoading}
                        displaySearchBox={true}
                        setFocus={!this.props.hrefValue}
                        showDropDownToggle={false}
                        allowEmpty={true}
                        searchTerm={this.state.searchTerm}
                        onSearchTermChange={this.handleSearchTermChange}
                        ListPreviewElement={LinkOption}
                        noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                        searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                        />
                    <IconButton className={style.linkIconButton__innerButton} icon="check" onClick={this.handleManualSetLink} />
                    <IconButton className={style.linkIconButton__innerButton} icon="ellipsis-v"/>
                </div>
            );
        }
        return (
            <div className={style.linkIconButton__flyout}>
                <div style={{flexGrow: 1}} onClick={this.handleSwitchToEditMode} role="button">
                    {this.state.isLoading ? <Icon icon="spinner" className={style.linkIconButton__loader} spin={true} size="lg" /> : (
                        this.state.options[0] ? <LinkOption option={this.state.options[0]} /> : (
                            <LinkOption option={{label: this.props.hrefValue, loaderUri: this.props.hrefValue}} />
                        )
                    )}
                </div>
                <IconButton className={style.linkIconButton__innerButton} icon="pencil-alt" onClick={this.handleSwitchToEditMode} />
                <IconButton className={style.linkIconButton__innerButton} icon="ellipsis-v" />
            </div>
        );
    }
}
