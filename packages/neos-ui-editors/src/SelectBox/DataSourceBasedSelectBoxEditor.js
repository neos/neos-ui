import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$transform} from 'plow-js';
import {connect} from 'react-redux';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {shouldDisplaySearchBox, searchOptions, processSelectBoxOptions} from './SelectBoxHelpers';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    dataSourcesDataLoader: globalRegistry.get('dataLoaders').get('DataSources')
}))
@connect($transform({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector
}))
export default class DataSourceBasedSelectBoxEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        options: PropTypes.shape({
            // TODO
            allowEmpty: PropTypes.bool,
            placeholder: PropTypes.string,

            multiple: PropTypes.bool,

            dataSourceIdentifier: PropTypes.string,
            dataSourceUri: PropTypes.string,
            dataSourceAdditionalData: PropTypes.objectOf(PropTypes.any),

            minimumResultsForSearch: PropTypes.number,

            values: PropTypes.objectOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    icon: PropTypes.string, // TODO test

                    // TODO
                    group: PropTypes.string
                })
            )

        }).isRequired,

        i18nRegistry: PropTypes.object.isRequired,
        dataSourcesDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired
        }).isRequired,

        focusedNodePath: PropTypes.string.isRequired
    };

    static defaultOptions = {
        // Use "5" as minimum result for search default; same as with old UI
        minimumResultsForSearch: 5
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            isLoading: false,
            selectBoxOptions: {}
        };
    }

    getDataLoaderOptions() {
        return {
            contextNodePath: this.props.focusedNodePath,
            dataSourceIdentifier: this.props.options.dataSourceIdentifier,
            dataSourceUri: this.props.options.dataSourceUri,
            dataSourceAdditionalData: this.props.options.dataSourceAdditionalData
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        this.props.dataSourcesDataLoader.resolveValue(this.getDataLoaderOptions(), this.props.value)
            .then(selectBoxOptions => {
                this.setState({
                    isLoading: false,
                    selectBoxOptions
                });
            });
    }

    render() {
        const {commit, value, i18nRegistry} = this.props;
        const options = Object.assign({}, this.defaultOptions, this.props.options);

        const processedSelectBoxOptions = processSelectBoxOptions(i18nRegistry, this.state.selectBoxOptions);

        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));

        if (options.multiple) {
            return (<MultiSelectBox
                options={processedSelectBoxOptions}
                values={value || []}
                onValuesChange={commit}
                displayLoadingIndicator={this.state.isLoading}
                placeholder={placeholder}

                displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
                searchOptions={searchOptions(this.state.searchTerm, processedSelectBoxOptions)}
                searchTerm={this.state.searchTerm}
                onSearchTermChange={this.handleSearchTermChange}
                />);
        }

        // multiple = FALSE
        return (<SelectBox
            options={this.state.searchTerm ? searchOptions(this.state.searchTerm, processedSelectBoxOptions) : processedSelectBoxOptions}
            value={value}
            onValueChange={commit}
            displayLoadingIndicator={this.state.isLoading}
            placeholder={placeholder}

            displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
            searchTerm={this.state.searchTerm}
            onSearchTermChange={this.handleSearchTermChange}
            />);
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }
}
