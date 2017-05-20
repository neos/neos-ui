import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const removePrefixFromNodeIdentifier = nodeIdentifierWithPrefix =>
    nodeIdentifierWithPrefix.replace('node://', '');

const appendPrefixBeforeNodeIdentifier = nodeIdentifier =>
    'node://' + nodeIdentifier;

@neos((globalRegistry, props) => {
    const dataLoaderOptions = {
        nodeTypes: $get('options.nodeTypes', props)
    };

    return {
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').getClient('NodeLookup', dataLoaderOptions),
        i18nRegistry: globalRegistry.get('i18n')
    }
})
@connect((state, {value, nodeLookupDataLoader}) => ({
    ...nodeLookupDataLoader.props(removePrefixFromNodeIdentifier(value), state)
}), (dispatch, {nodeLookupDataLoader}) => ({
    initializeDataLoader: (...args) => dispatch(nodeLookupDataLoader.doInitialize(...args))
}))
class LinkEditor extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string),
            placeholder: PropTypes.string
        }),

        initializeDataLoader: PropTypes.func.isRequired,

        isLoading: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };
    }

    optionGenerator({value, searchTerm, callback}) {
        const searchNodesQuery = this.props.contextForNodeLinking.toJS();
        if (searchTerm) {
            // autocomplete-load
            searchNodesQuery.searchTerm = searchTerm;
        } else {
            // no default set
            callback([]);
            return;
        }

        this.searchNodes(searchNodesQuery).then(result => {
            callback(result);
        });
    }

    componentDidMount() {
        this.props.initializeDataLoader(removePrefixFromNodeIdentifier(this.props.value));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.props.initializeDataLoader(removePrefixFromNodeIdentifier(this.props.value));
        }
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});

        // TODO!!
        this.props.nodeLookupDataLoader.doSearch('LinkEditor_' + this.props.identifier, searchTerm);
    }

    render() {
        const handleSelect = value => {
            this.props.commit(appendPrefixBeforeNodeIdentifier(value));
        };

        return (
            <SelectBox
                options={this.props.optionValues.toJS()}
                optionValueField="identifier"
                value={this.props.value && removePrefixFromNodeIdentifier(this.props.value)}
                placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
                displayLoadingIndicator={false}
                displaySearchBox={true}
                searchTerm={this.state.searchTerm}
                onSearchTermChange={this.handleSearchTermChange}
                />
        );
    }
}

export default LinkEditor;

