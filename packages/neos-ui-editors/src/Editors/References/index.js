import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {dndTypes} from '@neos-project/neos-ui-constants';
import ReferenceOption from '../Reference/ReferenceOption';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup'),
    nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
export default class ReferencesEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.arrayOf(PropTypes.string),
        highlight: PropTypes.bool,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            placeholder: PropTypes.string,
            threshold: PropTypes.number
        }),

        i18nRegistry: PropTypes.object.isRequired,
        nodeLookupDataLoader: PropTypes.shape({
            resolveValues: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,
        nodeTypeRegistry: PropTypes.shape({
            getNodeType: PropTypes.func.isRequired
        }),

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
            searchOptions: [],
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
        if (this.props.value && this.props.value.length) {
            this.setState({isLoading: true});
            this.props.nodeLookupDataLoader.resolveValues(this.getDataLoaderOptions(), this.props.value)
                .then(options => {
                    options.forEach(option => {
                        const nodeType = this.props.nodeTypeRegistry.getNodeType(option.nodeType);
                        const icon = $get('ui.icon', nodeType);
                        if (icon) {
                            option.icon = icon;
                        }
                    });

                    this.setState({
                        isLoading: false,
                        options
                    });
                });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.componentDidMount();
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        const threshold = $get('options.threshold', this.props) || this.constructor.defaultOptions.threshold;
        if (searchTerm && searchTerm.length >= threshold) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.nodeLookupDataLoader.search(this.getDataLoaderOptions(), searchTerm)
                .then(searchOptions => {
                    searchOptions.forEach(option => {
                        const nodeType = this.props.nodeTypeRegistry.getNodeType(option.nodeType);
                        const icon = $get('ui.icon', nodeType);
                        if (icon) {
                            option.icon = icon;
                        }
                    });

                    this.setState({
                        isLoading: false,
                        searchOptions
                    });
                });
        }
    }

    handleValuesChange = value => {
        this.props.commit(value);
    }

    render() {
        return (<MultiSelectBox
            options={this.state.options}
            dndType={dndTypes.MULTISELECT}
            optionValueField="identifier"
            values={this.props.value}
            highlight={this.props.highlight}
            onValuesChange={this.handleValuesChange}
            placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
            loadingLabel={this.props.i18nRegistry.translate('loading', 'Loading', [], 'Neos.Neos', 'Main')}
            displayLoadingIndicator={this.state.isLoading}
            displaySearchBox={true}
            searchTerm={this.state.searchTerm}
            searchOptions={this.state.searchOptions}
            onSearchTermChange={this.handleSearchTermChange}
            optionComponent={ReferenceOption}
            />);
    }
}
