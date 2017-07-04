import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

const removePrefixFromNodeIdentifier = nodeIdentifierWithPrefix =>
    nodeIdentifierWithPrefix && nodeIdentifierWithPrefix.replace('node://', '');

const appendPrefixBeforeNodeIdentifier = nodeIdentifier =>
    nodeIdentifier && 'node://' + nodeIdentifier;

const isUri = str =>
    str && Boolean(str.match('^https?://'));

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
@neos(globalRegistry => {
    return {
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup'),
        i18nRegistry: globalRegistry.get('i18n')
    };
})
class LinkEditor extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string),
            placeholder: PropTypes.string
        }),

        contextForNodeLinking: PropTypes.shape({
            toJS: PropTypes.func.isRequired
        }).isRequired,

        i18nRegistry: PropTypes.object.isRequired,
        nodeLookupDataLoader: PropTypes.shape({
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
            this.setState({
                searchTerm: this.props.value
            });
        } else {
            if (this.props.value) {
                this.setState({isLoading: true});
                this.props.nodeLookupDataLoader.resolveValue(this.getDataLoaderOptions(), removePrefixFromNodeIdentifier(this.props.value))
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
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.componentDidMount();
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
        if (isUri(searchTerm)) {
            this.setState({isLoading: false});
            this.props.commit(searchTerm);
        } else if (!searchTerm && isUri(this.props.value)) {
            // the user emptied the URL value, so we need to reset it
            this.props.commit('');
        } else if (searchTerm) {
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
        this.props.commit(appendPrefixBeforeNodeIdentifier(value));
    }

    render() {
        return (
            <SelectBox
                options={this.props.value ? this.state.options : this.state.searchOptions}
                optionValueField="identifier"
                value={this.props.value && removePrefixFromNodeIdentifier(this.props.value)}
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
