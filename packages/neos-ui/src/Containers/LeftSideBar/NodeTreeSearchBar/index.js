import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import mergeClassNames from 'classnames';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import {IconButton} from '@neos-project/react-ui-components';
import {Search} from '@neos-project/neos-ui-shared-components';
import NodeTreeFilter from './NodeTreeFilter/index';
import style from './style.module.css';

const searchDelay = 300;

@connect(state => ({
    isSearchBarVisible: state?.ui?.leftSideBar?.searchBar?.isVisible
}), {
    toggleSearchBar: actions.UI.LeftSideBar.toggleSearchBar
})

class NodeTreeSearchBar extends PureComponent {
    static propTypes = {
        rootNode: PropTypes.object,
        commenceSearch: PropTypes.func.isRequired,
        isSearchBarVisible: PropTypes.bool.isRequired,
        toggleSearchBar: PropTypes.func.isRequired
    }

    state = {
        searchValue: '',
        filterNodeType: null
    };

    constructor(props, ...args) {
        super(props, ...args);

        this.debouncedCommenceSearch = debounce(props.commenceSearch, searchDelay);
    }

    handleSearchChange = query => {
        const {rootNode} = this.props;
        const contextPath = rootNode?.contextPath;
        this.debouncedCommenceSearch(contextPath, {query: query.trim(), filterNodeType: this.state.filterNodeType});
        this.setState({searchValue: query});
    }

    handleFilterChange = filterNodeType => {
        const {rootNode, commenceSearch} = this.props;
        const contextPath = rootNode?.contextPath;
        commenceSearch(contextPath, {query: this.state.searchValue.trim(), filterNodeType});
        this.setState({filterNodeType});
    }

    handleSearchToggle = () => {
        const {toggleSearchBar} = this.props;
        toggleSearchBar();
    }

    render() {
        const {isSearchBarVisible} = this.props;
        const {searchValue, filterNodeType} = this.state;

        const searchToggleClassName = mergeClassNames({
            [style.searchToggleButton]: true,
            [style['searchToggleButton--active']]: isSearchBarVisible
        });

        return (
            <div className={style.searchWrapper}>
                <IconButton
                    id="btn-ToggleDocumentTreeFilter"
                    className={searchToggleClassName}
                    icon="ellipsis-v"
                    onClick={this.handleSearchToggle}
                    />
                {isSearchBarVisible && (
                    <div className={style.searchBar}>
                        <Search
                            id="neos-NodeTreeSearchInput"
                            initialValue={searchValue}
                            onChange={this.handleSearchChange}
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
