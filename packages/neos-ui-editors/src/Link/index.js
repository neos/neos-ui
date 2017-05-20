import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const removePrefixFromNodeIdentifier = nodeIdentifierWithPrefix =>
    nodeIdentifierWithPrefix.replace('node://', '');

const appendPrefixBeforeNodeIdentifier = nodeIdentifier =>
    'node://' + nodeIdentifier;

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}), {
    // TODO: updateSearchTerm -> doSearch
    updateSearchTerm: actions.UI.AsynchronousValueCache.updateSearchTerm
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
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

        contextForNodeLinking: PropTypes.object.isRequired,

        updateSearchTerm: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };

        this.searchNodes = backend.get().endpoints.searchNodes;
        this.optionGenerator = this.optionGenerator.bind(this);
    }

    optionGenerator({value, searchTerm, callback}) {
        const searchNodesQuery = this.props.contextForNodeLinking.toJS();
        if (value) {
            // INITIAL load
            searchNodesQuery.nodeIdentifiers = [removePrefixFromNodeIdentifier(value)];
        } else if (searchTerm) {
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

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});

        // TODO: remove the cache identifier setup here; DUPLICATED CODE!
        const targetNodeTypeNames = this.props.options.nodeTypes ? this.props.options.nodeTypes : ['Neos.Neos:Document'];
        const cacheIdentifier = 'NodeReference_' + targetNodeTypeNames.join(',');

        this.props.updateSearchTerm(cacheIdentifier, this.props.identifier, searchTerm);
    }

    render() {
        const handleSelect = value => {
            this.props.commit(appendPrefixBeforeNodeIdentifier(value));
        };

        return (
            <SelectBox
                options={[]}
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

