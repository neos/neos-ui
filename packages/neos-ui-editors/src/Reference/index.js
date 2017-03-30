import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string),
            placeholder: PropTypes.string,
            threshold: PropTypes.number
        }),

        contextForNodeLinking: PropTypes.object.isRequired,

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
            searchNodesQuery.nodeIdentifiers = [value];
        } else if (searchTerm && searchTerm.length >= this.props.options.threshold) {
            // autocomplete-load
            searchNodesQuery.searchTerm = searchTerm;
            searchNodesQuery.nodeTypes = this.props.options.nodeTypes;
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
        const handleSelect = value => {
            this.props.commit(value);
        };

        const clearInput = () => {
            this.props.commit('');
        };

        return (<SelectBox
            options={this.optionGenerator}
            value={this.props.value}
            placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
            onSelect={handleSelect}
            onDelete={clearInput}
            loadOptionsOnInput={true}
            />);
    }
}
