import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {SelectBox, MultiSelectBox} from '@neos-project/react-ui-components';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {shouldDisplaySearchBox, searchOptions, processSelectBoxOptions} from './SelectBoxHelpers';
import {createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue} from './createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue';
import PreviewOption from '../../Library/PreviewOption';

const getDataLoaderOptionsForProps = props => ({
    contextNodePath: props.focusedNodePath,
    dataSourceIdentifier: props.options.dataSourceIdentifier,
    dataSourceUri: props.options.dataSourceUri,
    dataSourceAdditionalData: props.options.dataSourceAdditionalData,
    dataSourceDisableCaching: Boolean(props.options.dataSourceDisableCaching)
});

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    dataSourcesDataLoader: globalRegistry.get('dataLoaders').get('DataSources')
}))
@connect(state => ({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector(state)
}))
export default class DataSourceBasedSelectBoxEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        className: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.shape({
                __identity: PropTypes.string.isRequired,
                __type: PropTypes.string
            }),
            PropTypes.arrayOf(
                PropTypes.shape({
                    __identity: PropTypes.string.isRequired,
                    __type: PropTypes.string
                })
            )
        ]),
        options: PropTypes.shape({
            allowEmpty: PropTypes.bool,
            placeholder: PropTypes.string,
            disabled: PropTypes.bool,

            multiple: PropTypes.bool,

            dataSourceIdentifier: PropTypes.string,
            dataSourceUri: PropTypes.string,
            dataSourceDisableCaching: PropTypes.bool,
            dataSourceAdditionalData: PropTypes.objectOf(PropTypes.any),

            minimumResultsForSearch: PropTypes.number,

            values: PropTypes.objectOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    icon: PropTypes.string,
                    preview: PropTypes.string,

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
        minimumResultsForSearch: 5,
        threshold: 0,
        disabled: false
    };

    state = {
        searchTerm: '',
        isLoading: false,
        selectBoxOptions: {}
    };

    componentDidMount() {
        this.loadSelectBoxOptions();
    }

    componentDidUpdate(prevProps) {
        // if our data loader options have changed (e.g. due to use of ClientEval), we want to re-initialize the data source.
        if (JSON.stringify(getDataLoaderOptionsForProps(this.props)) !== JSON.stringify(getDataLoaderOptionsForProps(prevProps))) {
            this.loadSelectBoxOptions();
        }
    }

    loadSelectBoxOptions() {
        this.setState({isLoading: true});
        this.props.dataSourcesDataLoader.resolveValue(getDataLoaderOptionsForProps(this.props), this.props.value)
            .then(selectBoxOptions => {
                this.setState({
                    isLoading: false,
                    selectBoxOptions
                });
            });
    }

    get valueForSingleSelect() {
        const {value} = this.props;
        return createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue(value);
    }

    get valueForMultiSelect() {
        const {value} = this.props;

        if (Array.isArray(value)) {
            return value.map(createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue);
        }

        return value ? [createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue(value)] : [];
    }

    render() {
        const {commit, i18nRegistry, className} = this.props;
        const options = Object.assign({}, this.constructor.defaultOptions, this.props.options);

        const processedSelectBoxOptions = processSelectBoxOptions(i18nRegistry, this.state.selectBoxOptions);

        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const loadingLabel = i18nRegistry.translate('loading', 'Loading', [], 'Neos.Neos', 'Main');

        if (options.multiple) {
            return (<MultiSelectBox
                className={className}
                options={processedSelectBoxOptions}
                values={this.valueForMultiSelect}
                onValuesChange={commit}
                loadingLabel={loadingLabel}
                ListPreviewElement={PreviewOption}
                displayLoadingIndicator={this.state.isLoading}
                placeholder={placeholder}
                allowEmpty={options.allowEmpty}
                displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
                searchOptions={searchOptions(this.state.searchTerm, processedSelectBoxOptions)}
                onSearchTermChange={this.handleSearchTermChange}
                noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                threshold={options.threshold}
                disabled={options.disabled}
            />);
        }

        // multiple = FALSE
        return (<SelectBox
            className={className}
            options={this.state.searchTerm ? searchOptions(this.state.searchTerm, processedSelectBoxOptions) : processedSelectBoxOptions}
            value={this.valueForSingleSelect}
            onValueChange={commit}
            loadingLabel={loadingLabel}
            ListPreviewElement={PreviewOption}
            displayLoadingIndicator={this.state.isLoading}
            placeholder={placeholder}
            allowEmpty={options.allowEmpty}
            displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
            onSearchTermChange={this.handleSearchTermChange}
            noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
            searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
            threshold={options.threshold}
            disabled={options.disabled}
        />);
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }
}
