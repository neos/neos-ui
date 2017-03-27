import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const removePrefixFromNodeIdentifier = (nodeIdentifierWithPrefix) => {
    return nodeIdentifierWithPrefix.replace('node://', '');
};

const appendPrefixBeforeNodeIdentifier = (nodeIdentifier) => {
    return 'node://' + nodeIdentifier
};

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking,
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class LinkEditor extends Component {
    static propTypes = {
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string)
        }),

        i18nRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

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

    render() {
        const handleSelect = (value) => {
            this.props.commit(appendPrefixBeforeNodeIdentifier(value));
        };

        const clearInput = () => {
            this.props.commit('');
        };

        return (<SelectBox
            options={this.optionGenerator}
            value={this.props.value && removePrefixFromNodeIdentifier(this.props.value)}
            placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
            onSelect={handleSelect}
            onDelete={clearInput}
            loadOptionsOnInput={true}
        />);
    }
}

export default LinkEditor;

