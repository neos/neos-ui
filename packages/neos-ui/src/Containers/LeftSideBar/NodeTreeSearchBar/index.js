import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import {$get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import NodeTreeSearchInput from './NodeTreeSearchInput/index';
import NodeTreeFilter from './NodeTreeFilter/index';
import style from './style.css';

const searchDelay = 300;

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class NodeTreeSearchBar extends PureComponent {

    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        rootNode: PropTypes.object,
        commenceSearch: PropTypes.func.isRequired
    }

    constructor(props, ...args) {
        super(props, ...args);

        this.debouncedCommenceSearch = debounce(props.commenceSearch, searchDelay);
        this.state = {
            searchFocused: false,
            searchValue: '',
            filterNodeType: null
        };
    }

    handleSearchChange = query => {
        const {rootNode} = this.props;
        const contextPath = $get('contextPath', rootNode);
        this.debouncedCommenceSearch(contextPath, {query, filterNodeType: this.state.filterNodeType});
        this.setState({searchValue: query});
    }

    handleFilterChange = filterNodeType => {
        const {rootNode, commenceSearch} = this.props;
        const contextPath = $get('contextPath', rootNode);
        commenceSearch(contextPath, {query: this.state.searchValue, filterNodeType});
        this.setState({filterNodeType});
    }

    handleSearchFocus = () => {
        this.setState({searchFocused: true});
    }

    handleSearchBlur = () => {
        this.setState({searchFocused: false});
    }

    handleClearClick = () => {
        const {commenceSearch, rootNode} = this.props;
        const contextPath = $get('contextPath', rootNode);
        this.setState({
            searchValue: '',
            showClear: false
        });
        commenceSearch(contextPath, {query: '', filterNodeType: this.state.filterNodeType});
    }

    render() {
        const {i18nRegistry} = this.props;
        const {searchValue, searchFocused, filterNodeType} = this.state;
        const searchLabel = i18nRegistry.translate('search', 'Search', {}, 'Neos.Neos', 'Main');

        return (
            <div className={style.searchBar}>
                <div>
                    <NodeTreeSearchInput
                        label={searchLabel}
                        value={searchValue}
                        focused={searchFocused}
                        onChange={this.handleSearchChange}
                        onFocus={this.handleSearchFocus}
                        onBlur={this.handleSearchBlur}
                        onClearClick={this.handleClearClick}
                        />
                </div>
                <div>
                    <NodeTreeFilter
                        value={filterNodeType}
                        onChange={this.handleFilterChange}
                        />
                </div>
            </div>
        );
    }
}

export const PageTreeSearchbar = connect(state => ({
    rootNode: selectors.CR.Nodes.siteNodeSelector(state)
}), {
    commenceSearch: actions.UI.PageTree.commenceSearch
})(NodeTreeSearchBar);
