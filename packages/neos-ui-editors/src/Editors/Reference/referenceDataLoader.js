import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

export default isMulti => WrappedComponent => {
    @neos(globalRegistry => ({
        i18nRegistry: globalRegistry.get('i18n'),
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup'),
        nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
    }))
    @connect($transform({
        contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
    }))
    class ReferenceDataLoader extends PureComponent {
        static defaultOptions = {
            // start searching after 2 characters, as it was done in the old UI
            threshold: 2
        };

        static propTypes = {
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            highlight: PropTypes.bool,
            commit: PropTypes.func.isRequired,
            options: PropTypes.shape({
                nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
                placeholder: PropTypes.string,
                threshold: PropTypes.number
            }),

            i18nRegistry: PropTypes.object.isRequired,
            nodeLookupDataLoader: PropTypes.shape({
                resolveValue: PropTypes.func.isRequired,
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

        state = {
            searchTerm: '',
            isLoading: false,
            options: [],
            searchOptions: [],
            results: []
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
                const resolver = isMulti ? this.props.nodeLookupDataLoader.resolveValues.bind(this.props.nodeLookupDataLoader) : this.props.nodeLookupDataLoader.resolveValue.bind(this.props.nodeLookupDataLoader);
                resolver(this.getDataLoaderOptions(), this.props.value)
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

        handleValueChange = value => {
            this.props.commit(value);
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

        getDataLoaderOptions() {
            return {
                nodeTypes: $get('options.nodeTypes', this.props) || ['Neos.Neos:Document'],
                contextForNodeLinking: this.props.contextForNodeLinking.toJS()
            };
        }

        render() {
            const props = Object.assign({}, this.props, this.state);
            const options = isMulti ? this.state.options : (this.props.value ? this.state.options : this.state.searchOptions);
            return (
                <WrappedComponent
                    {...props}
                    options={options}
                    searchTerm={this.state.searchTerm}
                    searchOptions={this.state.searchOptions}
                    displayLoadingIndicator={this.state.isLoading}
                    onValueChange={this.handleValueChange}
                    onSearchTermChange={this.handleSearchTermChange}
                    placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
                    />
            );
        }

    }
    return ReferenceDataLoader;
};
