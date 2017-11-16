import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import AssetOption from '@neos-project/neos-ui-ckeditor-bindings/src/EditorToolbar/AssetOption';
import {dndTypes} from '@neos-project/neos-ui-constants';
import {neos} from '@neos-project/neos-ui-decorators';
import {$get} from 'plow-js';

@neos(globalRegistry => ({
    assetLookupDataLoader: globalRegistry.get('dataLoaders').get('AssetLookup'),
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class AssetEditor extends PureComponent {
    state = {
        options: [],
        isLoading: false,
        searchOptions: [],
        searchTerm: ''
    };

    static defaultOptions = {
        // start searching after 2 characters, as it was done in the old UI
        threshold: 2
    };

    static propTypes = {
        value: PropTypes.arrayOf(PropTypes.string),
        options: PropTypes.object,
        searchOptions: PropTypes.array,
        highlight: PropTypes.bool,
        placeholder: PropTypes.string,
        displayLoadingIndicator: PropTypes.bool,
        onSearchTermChange: PropTypes.func,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        assetLookupDataLoader: PropTypes.shape({
            resolveValues: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired
    };

    componentDidMount() {
        this.resolveValue();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.resolveValue();
        }
    }

    resolveValue = () => {
        if (this.props.value) {
            this.setState({isLoading: true});
            const resolver = this.props.assetLookupDataLoader.resolveValues.bind(this.props.assetLookupDataLoader);
            resolver({}, this.props.value)
                .then(options => {
                    this.setState({
                        isLoading: false,
                        options
                    });
                });
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        const threshold = $get('options.threshold', this.props) || this.constructor.defaultOptions.threshold;
        if (searchTerm && searchTerm.length >= threshold) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.assetLookupDataLoader.search({}, searchTerm)
                .then(searchOptions => {
                    this.setState({
                        isLoading: false,
                        searchOptions
                    });
                });
        }
    }

    handleValueChange = value => {
        this.setState({searchOptions: [], searchTerm: ''});
        this.props.commit(value);
    }

    handleCreateNew = () => {
    }

    render() {
        return (<MultiSelectBox
            dndType={dndTypes.MULTISELECT}
            optionValueField="identifier"
            loadingLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:loading')}
            displaySearchBox={true}
            optionComponent={AssetOption}
            createNewLabel={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:createNew')}
            placeholder={this.props.i18nRegistry.translate(this.props.placeholder)}
            options={this.state.options || []}
            values={this.props.value}
            highlight={this.props.highlight}
            onValuesChange={this.handleValueChange}
            displayLoadingIndicator={this.props.displayLoadingIndicator}
            searchTerm={this.state.searchTerm}
            searchOptions={this.state.searchOptions}
            onCreateNew={this.handleCreateNew}
            onSearchTermChange={this.handleSearchTermChange}
            />);
    }
}
