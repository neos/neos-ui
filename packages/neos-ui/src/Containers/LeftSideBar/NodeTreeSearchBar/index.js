import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import {$transform, $get} from 'plow-js';
import mergeClassNames from 'classnames';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import {IconButton} from '@neos-project/react-ui-components';
import NodeTreeSearchInput from './NodeTreeSearchInput/index';
import NodeTreeFilter from './NodeTreeFilter/index';
import style from './style.css';

const searchDelay = 300;

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

@connect($transform({
    isSearchBarVisible: $get('ui.leftSideBar.searchBar.isVisible')
}), {
    toggleSearchBar: actions.UI.LeftSideBar.toggleSearchBar
})

class NodeTreeSearchBar extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        rootNode: PropTypes.object,
        commenceSearch: PropTypes.func.isRequired,
        isSearchBarVisible: PropTypes.bool.isRequired,
        toggleSearchBar: PropTypes.func.isRequired
    }

    state = {
        searchFocused: false,
        searchValue: '',
        filterNodeType: null
    };

    constructor(props, ...args) {
        super(props, ...args);

        this.debouncedCommenceSearch = debounce(props.commenceSearch, searchDelay);
    }

    handleSearchChange = query => {
        const {rootNode} = this.props;
        const contextPath = $get('contextPath', rootNode);
        this.debouncedCommenceSearch(contextPath, {query: query.trim(), filterNodeType: this.state.filterNodeType});
        this.setState({searchValue: query});
    }

    handleFilterChange = filterNodeType => {
        const {rootNode, commenceSearch} = this.props;
        const contextPath = $get('contextPath', rootNode);
        commenceSearch(contextPath, {query: this.state.searchValue.trim(), filterNodeType});
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

    handleSearchToggle = () => {
        const {toggleSearchBar} = this.props;
        toggleSearchBar();
    }

    render() {
        const {i18nRegistry, isSearchBarVisible} = this.props;
        const {searchValue, searchFocused, filterNodeType} = this.state;
        const searchLabel = i18nRegistry.translate('search', 'Search', {}, 'Neos.Neos', 'Main');

        const searchToggleClassName = mergeClassNames({
            [style.searchToggleButton]: true,
            [style['searchToggleButton--active']]: isSearchBarVisible
        });

        return (
            <div className={style.searchWrapper}>
                <IconButton
                    className={searchToggleClassName}
                    icon="ellipsis-v"
                    onClick={this.handleSearchToggle}
                    />
                {isSearchBarVisible && (
                    <div className={style.searchBar}>
                        <NodeTreeSearchInput
                            label={searchLabel}
                            value={searchValue}
                            focused={searchFocused}
                            onChange={this.handleSearchChange}
                            onFocus={this.handleSearchFocus}
                            onBlur={this.handleSearchBlur}
                            onClearClick={this.handleClearClick}
                            />
                        <NodeTreeFilter
                            value={filterNodeType}
                            onChange={this.handleFilterChange}
                            />
                    </div>
                )}
            </div>
        );
    }
}

export const PageTreeSearchbar = connect(state => ({
    rootNode: selectors.CR.Nodes.siteNodeSelector(state)
}), {
    commenceSearch: actions.UI.PageTree.commenceSearch
}, (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, dispatchProps, ownProps);
})(NodeTreeSearchBar);
