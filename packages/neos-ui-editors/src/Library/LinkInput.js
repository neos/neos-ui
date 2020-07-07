import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import {IconButton, SelectBox, Icon} from '@neos-project/react-ui-components';
import LinkOption from '@neos-project/neos-ui-editors/src/Library/LinkOption';
import {neos} from '@neos-project/neos-ui-decorators';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {isUri, isEmail} from '@neos-project/utils-helpers';

import style from './LinkInput.css';

// TODO: extract this isInternalLink logic into a registry, possibly defining a schema and a custom data loader
const isUriOrInternalLink = link => Boolean(isUri(link) || link.indexOf('node://') === 0 || link.indexOf('asset://') === 0);
const isInternalLink = link => Boolean(link.indexOf('node://') === 0 || link.indexOf('asset://') === 0);
const looksLikeExternalLink = link => {
    if (typeof link !== 'string') {
        return false;
    }
    if (isUriOrInternalLink(link)) {
        return false;
    }
    if (link.match(/^[\w.-]{2,}\.[\w]{2,10}$/)) {
        return true;
    }
    return false;
};

@neos(globalRegistry => ({
    linkLookupDataLoader: globalRegistry.get('dataLoaders').get('LinkLookup'),
    i18nRegistry: globalRegistry.get('i18n'),
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
export default class LinkInput extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object,
        containerRegistry: PropTypes.object,
        linkingOptions: PropTypes.object,
        options: PropTypes.shape({
            nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            placeholder: PropTypes.string,
            disabled: PropTypes.bool,
            assets: PropTypes.bool,
            nodes: PropTypes.bool,
            startingPoint: PropTypes.string
        }),
        setFocus: PropTypes.bool,
        linkValue: PropTypes.string,
        linkTitleValue: PropTypes.string,
        linkRelNofollowValue: PropTypes.bool,
        linkTargetBlankValue: PropTypes.bool,
        onLinkChange: PropTypes.func.isRequired,
        onLinkRelChange: PropTypes.func,
        onLinkTargetChange: PropTypes.func,
        onLinkTitleChange: PropTypes.func,

        linkLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        contextForNodeLinking: PropTypes.shape({
            workspaceName: PropTypes.string.isRequired,
            contextNode: PropTypes.string,
            dimensions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
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
        const options = {...this.props.options, ...this.props.linkingOptions};

        const contextForNodeLinking = $get('startingPoint', options) ?
            {...this.props.contextForNodeLinking, contextNode: options.startingPoint} :
            this.props.contextForNodeLinking;

        return {
            nodeTypes: $get('nodeTypes', options) || ['Neos.Neos:Document'],
            asset: $get('assets', options),
            node: $get('nodes', options),
            startingPoint: $get('startingPoint', options),
            contextForNodeLinking
        };
    }

    componentDidMount() {
        this.refreshState();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.linkValue !== this.props.linkValue) {
            this.refreshState();
        }
    }

    refreshState() {
        if (this.props.linkValue) {
            if (isInternalLink(this.props.linkValue)) {
                this.setState({
                    isLoading: true,
                    isEditMode: false
                });
                this.props.linkLookupDataLoader.resolveValue(this.getDataLoaderOptions(), this.props.linkValue.split('#')[0])
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

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        if (looksLikeExternalLink(searchTerm)) {
            this.setState({
                isLoading: false,
                searchOptions: [{
                    label: this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__formatAsHttp', 'Format as http link?'),
                    loaderUri: `http://${searchTerm}`
                }]
            });
        } else if (isEmail(searchTerm)) {
            this.setState({
                isLoading: false,
                searchOptions: [{
                    label: this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__formatAsEmail', 'Format as email?'),
                    loaderUri: `mailto:${searchTerm}`
                }]
            });
        } else if (isUriOrInternalLink(searchTerm)) {
            this.setState({
                isLoading: false,
                searchOptions: []
            });
        } else if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            // We store the searchTerm at the moment lookup was triggered, and only update the options if the search term hasn't changed
            const searchTermWhenLookupWasTriggered = searchTerm;
            this.props.linkLookupDataLoader.search(this.getDataLoaderOptions(), searchTerm)
                .then(searchOptions => {
                    if (searchTermWhenLookupWasTriggered === this.state.searchTerm) {
                        this.setState({
                            isLoading: false,
                            searchOptions
                        });
                    }
                });
        } else {
            this.setState({
                isLoading: false
            });
        }
    }

    handleSearchTermKeyPress = e => {
        if (e && e.key === 'Enter') {
            this.handleManualSetLink();
        }
    }

    handleValueChange = value => {
        this.props.onLinkChange(value || '');

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
        } else {
            this.setState({
                isEditMode: false
            });
        }
    }

    handleManualSetLink = () => {
        this.props.onLinkChange(this.state.searchTerm);
        this.setState({
            isEditMode: false
        });
    }

    handleSwitchToEditMode = () => {
        this.setState({
            isEditMode: true,
            searchTerm: this.props.linkValue
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
                    placeholder={this.props.i18nRegistry.translate($get('options.placeholder', this.props) || 'Neos.Neos.Ui:Main:ckeditor__toolbar__link__placeholder', 'Paste a link, or search')}
                    displayLoadingIndicator={this.state.isLoading}
                    displaySearchBox={true}
                    setFocus={this.props.setFocus}
                    showDropDownToggle={false}
                    allowEmpty={true}
                    searchTerm={this.state.searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    onSearchTermKeyPress={this.handleSearchTermKeyPress}
                    ListPreviewElement={LinkOption}
                    noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:noMatchesFound')}
                    searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:searchBoxLeftToType')}
                />
                <IconButton
                    className={style.linkInput__innerButton}
                    icon="check"
                    onClick={this.handleManualSetLink}
                    title={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__apply', 'Apply link')}
                />
            </Fragment>
        );
    }

    renderLinkOption = () => {
        // if options then it's an asset or node, otherwise a plain link
        if (this.state.options[0]) {
            return <LinkOption option={this.state.options[0]} />;
        }
        return (
            <LinkOption option={{
                icon: this.props.linkValue.startsWith('mailto:') ? 'at' : 'external-link-alt',
                label: this.props.linkValue,
                loaderUri: this.props.linkValue
            }} />
        );
    }

    renderViewMode() {
        return (
            <Fragment>
                <div className={style.linkInput__optionWrapper} onClick={this.handleSwitchToEditMode} role="button">
                    {this.state.isLoading ? <div className={style.linkInput__loaderWrapper}><Icon icon="spinner" className={style.linkInput__loader} spin={true} size="lg" /></div> : this.renderLinkOption()}
                </div>
                <IconButton
                    className={style.linkInput__innerButton}
                    icon="pencil-alt"
                    onClick={this.handleSwitchToEditMode}
                    title={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__edit', 'Edit link')}
                />
            </Fragment>
        );
    }

    getBaseValue = () => {
        const {linkValue} = this.props;
        if (typeof linkValue === 'string') {
            return linkValue.split('#')[0];
        }
        return '';
    }

    getAnchorValue = () => {
        const {linkValue} = this.props;
        if (typeof linkValue === 'string') {
            return linkValue.split('#')[1];
        }
        return '';
    }

    renderOptionsPanel() {
        return (
            <div className={style.linkInput__optionsPanel}>
                {this.props.containerRegistry.getChildren('LinkInput/OptionsPanel').map((Item, key) => <Item key={key} {...this.props} />)}

            </div>
        );
    }

    render() {
        const {linkingOptions, linkValue} = this.props;

        const optionsPanelEnabled = Boolean(linkingOptions && Object.values(linkingOptions).filter(i => i).length);
        return (
            <div>
                <div className={style.linkInput__wrap}>
                    {this.state.isEditMode && !$get('options.disabled', this.props) ? this.renderEditMode() : this.renderViewMode()}
                    {optionsPanelEnabled && (
                        <IconButton
                            disabled={!linkValue}
                            onClick={this.handleToggleOptionsPanel}
                            style={this.state.optionsPanelIsOpen ? 'brand' : 'transparent'}
                            className={style.linkInput__innerButton}
                            title={this.state.optionsPanelIsOpen ? this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__hideOptions', 'Hide link options') : this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__showOptions', 'Link options')}
                            icon="cog"
                        />
                    )}
                </div>
                {this.state.optionsPanelIsOpen && this.renderOptionsPanel()}
            </div>
        );
    }
}
