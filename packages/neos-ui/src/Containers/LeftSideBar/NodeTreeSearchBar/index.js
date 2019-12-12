import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import {$get} from 'plow-js';
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

class NodeTreeSearchBar extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        rootNode: PropTypes.object,
        commenceSearch: PropTypes.func.isRequired
    }

    state = {
        searchToggled: false,
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
        this.setState({
            searchToggled: !this.state.searchToggled
        });
    }

    render() {
        const {i18nRegistry} = this.props;
        const {searchToggled, searchValue, searchFocused, filterNodeType} = this.state;
        const searchLabel = i18nRegistry.translate('search', 'Search', {}, 'Neos.Neos', 'Main');

        const searchToggleClassName = mergeClassNames({
            [style.searchToggleButton]: true,
            [style['searchToggleButton--active']]: searchToggled
        });

        return (
            <div className={style.searchWrapper}>
                <IconButton
                    className={searchToggleClassName}
                    icon="ellipsis-v"
                    onClick={this.handleSearchToggle}
                    />
                {searchToggled && (
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
})(NodeTreeSearchBar);
