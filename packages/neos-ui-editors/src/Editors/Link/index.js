import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

const removePrefixFromNodeIdentifier = nodeIdentifierWithPrefix =>
    nodeIdentifierWithPrefix && nodeIdentifierWithPrefix.replace('node://', '');

const appendPrefixBeforeNodeIdentifier = nodeIdentifier =>
    nodeIdentifier && 'node://' + nodeIdentifier;

const removePrefixFromAssetIdentifier = assetIdentifierWithPrefix =>
    assetIdentifierWithPrefix && assetIdentifierWithPrefix.replace('asset://', '');

const appendPrefixBeforeAssetIdentifier = assetIdentifier =>
    assetIdentifier && 'asset://' + assetIdentifier;

const isUri = str =>
    str && Boolean(str.match('^https?://'));

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
@neos(globalRegistry => {
    return {
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup'),
        assetLookupDataLoader: globalRegistry.get('dataLoaders').get('AssetLookup'),
        nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
        i18nRegistry: globalRegistry.get('i18n')
    };
})
class LinkEditor extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        highlight: PropTypes.bool,
        options: PropTypes.shape({
            nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            placeholder: PropTypes.string
        }),

        contextForNodeLinking: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired,
        nodeTypeRegistry: PropTypes.shape({
            getNodeType: PropTypes.func.isRequired
        }),
        i18nRegistry: PropTypes.object.isRequired,

        nodeLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired,

        assetLookupDataLoader: PropTypes.shape({
            resolveValue: PropTypes.func.isRequired,
            search: PropTypes.func.isRequired
        }).isRequired
    };

    constructor(...args) {
        super(...args);

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
        if (isUri(this.props.value)) {
            const options = [{
                icon: 'icon-external-link',
                identifier: this.props.value,
                label: this.props.value
            }];

            this.setState({
                searchTerm: this.props.value,
                options
            });
        } else {
            if (this.props.value) {
                this.setState({isLoading: true});
                this.props.assetLookupDataLoader.resolveValue({}, removePrefixFromAssetIdentifier(this.props.value))
                    .then(asset => {
                        options.forEach(option => {
                            const nodeType = this.props.nodeTypeRegistry.getNodeType(option.nodeType);
                            const icon = $get('ui.icon', nodeType);
                            if (icon) {
                                option.icon = icon;
                            }
                        });

                        this.setState({
                            isLoading: false,
                            options: [asset]
                        });
                    });
            }
            this.setState({
                searchTerm: '',
                searchOptions: []
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
        if (isUri(searchTerm)) {
            const searchOptions = [{
                icon: 'icon-external-link',
                identifier: searchTerm,
                label: searchTerm
            }];

            this.setState({
                isLoading: false,
                searchOptions
            });
        } else if (!searchTerm && isUri(this.props.value)) {
            // the user emptied the URL value, so we need to reset it
            this.props.commit('');
        } else if (searchTerm) {
            this.setState({isLoading: true, searchOptions: []});
            this.props.assetLookupDataLoader.search({}, searchTerm)
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

    handleValueChange = value => {
        if (isUri(value)) {
        this.props.commit(appendPrefixBeforeAssetIdentifier(value));
        } else {
            this.props.commit(appendPrefixBeforeNodeIdentifier(value));
        }
    }

    render() {
        return (
            <SelectBox
                options={this.props.value ? this.state.options : this.state.searchOptions}
                optionValueField="identifier"
                highlight={this.props.highlight}
                value={this.props.value && removePrefixFromAssetIdentifier(this.props.value)}
                onValueChange={this.handleValueChange}
                placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
                displayLoadingIndicator={this.state.isLoading}
                displaySearchBox={true}
                searchTerm={this.state.searchTerm}
                onSearchTermChange={this.handleSearchTermChange}
                />
        );
    }
}

export default LinkEditor;
