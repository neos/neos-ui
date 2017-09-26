import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {neos} from '@neos-project/neos-ui-decorators';
import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

/**
 * The Actual StyleSelect component
 */
@connect($transform({
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
export default class LinkIconButton extends PureComponent {

    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object
        ])),
        formattingRule: PropTypes.string
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
        return (
            <div>
                <IconButton
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

const isUri = str =>
    str && Boolean(str.match('^(https?://|mailto:|tel:)'));

const stripNodePrefix = str =>
    str && str.replace('node://', '');

@neos(globalRegistry => ({
    nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup')
}))
@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
class LinkTextField extends PureComponent {

    static propTypes = {
        formattingRule: PropTypes.string,
        hrefValue: PropTypes.string,

        nodeLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        contextForNodeLinking: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            isLoading: false,
            searchResults: [],
            results: []
        };
    }

    getDataLoaderOptions() {
        return {
            nodeTypes: ['Neos.Neos:Document'],
            contextForNodeLinking: this.props.contextForNodeLinking.toJS()
        };
    }

    componentDidMount() {
        if (isUri(this.props.hrefValue)) {
            this.setState({
                searchTerm: this.props.hrefValue
            });
        } else {
            if (this.props.hrefValue) {
                this.setState({isLoading: true});
                this.props.nodeLookupDataLoader.resolveValue(this.getDataLoaderOptions(), stripNodePrefix(this.props.hrefValue))
                    .then(options => {
                        this.setState({
                            isLoading: false,
                            options
                        });
                    });
            }
            this.setState({
                searchTerm: ''
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hrefValue !== this.props.hrefValue) {
            this.componentDidMount();
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        if (isUri(searchTerm)) {
            this.setState({isLoading: false});
            getGuestFrameWindow().NeosCKEditorApi
                .toggleFormat(this.props.formattingRule, {href: searchTerm});
        } else if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.nodeLookupDataLoader.search(this.getDataLoaderOptions(), searchTerm)
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
        if (value) {
            getGuestFrameWindow().NeosCKEditorApi
                .toggleFormat(this.props.formattingRule, {href: 'node://' + value});
        } else {
            getGuestFrameWindow().NeosCKEditorApi
                .toggleFormat(this.props.formattingRule, {href: ''});
        }
    }

    render() {
        return (
            <div className={style.linkIconButton__flyout}>
                <SelectBox
                    options={this.props.hrefValue ? this.state.options : this.state.searchOptions}
                    optionValueField="identifier"
                    value={this.props.hrefValue && stripNodePrefix(this.props.hrefValue)}
                    onValueChange={this.handleValueChange}
                    placeholder="Paste a link, or search"
                    displayLoadingIndicator={this.state.isLoading}
                    displaySearchBox={true}
                    searchTerm={this.state.searchTerm}
                    onSearchTermChange={this.handleSearchTermChange}
                    />
            </div>
        );
    }
}
