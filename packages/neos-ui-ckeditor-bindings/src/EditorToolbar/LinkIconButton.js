import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import LinkOption from '@neos-project/neos-ui-editors/src/Library/LinkOption';
import {neos} from '@neos-project/neos-ui-decorators';
import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

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
            PropTypes.object,
            PropTypes.string
        ])),
        formattingRule: PropTypes.string,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleLinkButtonClick = () => {
        const {NeosCKEditorApi} = getGuestFrameWindow();

        if (this.isOpen()) {
            NeosCKEditorApi.toggleFormat(this.props.formattingRule, {remove: true});
        } else {
            NeosCKEditorApi.toggleFormat(this.props.formattingRule, {href: ''});
        }
    }

    render() {
        const {i18nRegistry} = this.props;

        return (
            <div>
                <IconButton
                    title={`${i18nRegistry.translate('Neos.Neos:Main:ckeditor__toolbar__link')}`}
                    isActive={Boolean(this.getHrefValue())}
                    icon="link"
                    onClick={this.handleLinkButtonClick}
                    />
                {this.isOpen() ? <LinkTextField hrefValue={this.getHrefValue()} formattingRule={this.props.formattingRule}/> : null}
            </div>
        );
    }

    isOpen() {
        return this.getHrefValue() === '' || this.getHrefValue();
    }

    getHrefValue() {
        return $get([this.props.formattingRule, 'href'], this.props.formattingUnderCursor);
    }
}

// allow to insert node:// and asset:// links by pasting
const isUriOrInternalLink = link => Boolean(isUri(link) || link.indexOf('node://') === 0 || link.indexOf('asset://') === 0);
// If node links have a hash in them, treat them like normal links
const isUriOrHasHash = link => Boolean(isUri(link) || link.includes('#'));

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
        formattingRule: PropTypes.string,
        hrefValue: PropTypes.string,

        linkLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        contextForNodeLinking: PropTypes.object.isRequired
    };

    state = {
        searchTerm: '',
        isLoading: false,
        searchOptions: [],
        options: []
    };

    getDataLoaderOptions() {
        return {
            nodeTypes: ['Neos.Neos:Document'],
            contextForNodeLinking: this.props.contextForNodeLinking
        };
    }

    refreshState() {
        if (isUriOrHasHash(this.props.hrefValue)) {
            this.setState({
                searchTerm: this.props.hrefValue,
                options: []
            });
        } else {
            if (this.props.hrefValue) {
                this.setState({isLoading: true});
                this.props.linkLookupDataLoader.resolveValue(this.getDataLoaderOptions(), this.props.hrefValue)
                    .then(options => {
                        this.setState({
                            isLoading: false,
                            options
                        });
                    });
            }
            // ToDo: Couldn't this lead to bugs in the future due to the async operation on top?
            this.setState({
                searchTerm: ''
            });
        }
    }

    componentDidMount() {
        this.refreshState();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.hrefValue !== this.props.hrefValue) {
            this.refreshState();
        }
    }

    // TODO: this should be debounced, but it's super hard to do, because then hrefValue would override searchTerm
    commitValue = value => getGuestFrameWindow().NeosCKEditorApi.toggleFormat(this.props.formattingRule, {href: value});

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        if (isUriOrInternalLink(searchTerm)) {
            this.commitValue(searchTerm);

            this.setState({
                isLoading: false,
                searchOptions: []
            });
        } else if (!searchTerm && isUriOrInternalLink(this.props.hrefValue)) {
            // The user emptied the URL value, so we need to reset it
            this.commitValue('');
        } else if (searchTerm) {
            // When changing from uri mode to search mode, we should clear the value
            if (isUriOrInternalLink(this.state.searchTerm)) {
                this.commitValue('');
            }
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

        if (!isUriOrHasHash(value)) {
            const options = this.state.searchOptions.reduce((current, option) =>
                    (option.loaderUri === value) ? [Object.assign({}, option)] : current
                , []);

            this.setState({options, searchOptions: [], searchTerm: ''});
        }
    }

    render() {
        return (
            <div className={style.linkIconButton__flyout}>
                <SelectBox
                    options={this.props.hrefValue ? this.state.options : this.state.searchOptions}
                    optionValueField="loaderUri"
                    value={isUriOrHasHash(this.props.hrefValue) ? '' : this.props.hrefValue}
                    plainInputMode={isUriOrHasHash(this.props.hrefValue)}
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
            </div>
        );
    }
}
