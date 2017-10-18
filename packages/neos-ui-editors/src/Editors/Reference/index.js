import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import ReferenceOption from './ReferenceOption';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup')
}))
@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        highlight: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            placeholder: PropTypes.string,
            threshold: PropTypes.number
        }),

        i18nRegistry: PropTypes.object.isRequired,
        nodeLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        contextForNodeLinking: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired
    };

    static defaultOptions = {
        // start searching after 2 characters, as it was done in the old UI
        threshold: 2
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
            nodeTypes: $get('options.nodeTypes', this.props) || ['Neos.Neos:Document'],
            contextForNodeLinking: this.props.contextForNodeLinking.toJS()
        };
    }

    componentDidMount() {
        if (this.props.value) {
            this.setState({isLoading: true});
            this.props.nodeLookupDataLoader.resolveValue(this.getDataLoaderOptions(), this.props.value)
                .then(options => {
                    this.setState({
                        isLoading: false,
                        options
                    });
                });
        }
        this.setState({
            searchTerm: '',
            searchOptions: []
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.componentDidMount();
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        const threshold = $get('options.threshold', this.props) || this.defaultOptions.threshold;
        if (searchTerm && searchTerm.length >= threshold) {
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

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        return (<SelectBox
            options={this.props.value ? this.state.options : this.state.searchOptions}
            optionValueField="identifier"
            value={this.props.value}
            highlight={this.props.highlight}
            onValueChange={this.handleValueChange}
            placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
            displayLoadingIndicator={this.state.isLoading}
            displaySearchBox={true}
            searchTerm={this.state.searchTerm}
            onSearchTermChange={this.handleSearchTermChange}
            optionComponent={ReferenceOption}
            />);
    }
}
