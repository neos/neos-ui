import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import {$get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {TextInput, IconButton} from '@neos-project/react-ui-components';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

console.log(style);
const searchDelay = 300;

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class NodeTreeSearchBar extends PureComponent {

    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        rootNode: PropTypes.object,
        search: PropTypes.func.isRequired
    }

    constructor(props, ...args) {
        super(props, ...args);

        this.debouncedSearch = debounce(props.search, searchDelay);
        this.state = {
            showClear: false,
            focused: false,
            value: ''
        };
    }

    handleSearchChange = query => {
        const {rootNode} = this.props;
        const contextPath = $get('contextPath', rootNode);
        this.setState({value: query, showClear: query.length > 0});
        this.debouncedSearch(contextPath, {query});
    }

    handleSearchFocus = () => {
        this.setState({focused: true});
    }

    handleSearchBlur = () => {
        this.setState({focused: false});
    }

    handleClearClick = () => {
        const {search, rootNode} = this.props;
        const contextPath = $get('contextPath', rootNode);
        this.setState({
            value: '',
            showClear: false
        });
        search(contextPath, {query: ''});
    }

    render() {
        const {i18nRegistry} = this.props;
        const {value, focused, showClear} = this.state;
        const label = i18nRegistry.translate('search', 'Search', {}, 'Neos.Neos', 'Main');

        return (
            <div className={style.searchBar}>
                <TextInput
                    placeholder={label}
                    onChange={this.handleSearchChange}
                    onFocus={this.handleSearchFocus}
                    onBlur={this.handleSearchBlur}
                    type="search"
                    value={value}
                    containerClassName={style.searchBar__searchInput}
                    />
                {showClear && (
                <IconButton
                    icon="times"
                    theme={{iconButton: focused ? style['searchBar__clearButton--focused'] : style.searchBar__clearButton}}
                    onClick={this.handleClearClick}
                    />
                )}
            </div>
        );
    }
}

export const PageTreeSearchbar = connect(state => ({
    rootNode: selectors.CR.Nodes.siteNodeSelector(state)
}), {
    search: actions.UI.PageTree.search
})(NodeTreeSearchBar);
