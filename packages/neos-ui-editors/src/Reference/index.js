import React, {Component, PropTypes} from 'react';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import backend from '@neos-project/neos-ui-backend-connector';


@connect($transform({
    activeWorkspace: $get('cr.workspaces.active'),
    siteNodePath: $get('cr.nodes.siteNode')
}))
export default class ReferenceEditor extends Component {

    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired,

        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string)
        }),

        activeWorkspace: PropTypes.string.isRequired,
        siteNodePath: PropTypes.string.isRequired
    };

    render() {
        const {commit} = this.props;
        const valueSoFar = this.props.value;
        const {searchNodes} = backend.get().endpoints;

        const options = ({value, callback}) => {
            const searchQuery = {
                // TODO: dimensons!
                workspaceName: this.props.activeWorkspace,
                contextNode: this.props.siteNodePath
            };

            if (!value && valueSoFar) {
                searchQuery.nodeIdentifiers = [valueSoFar];
            } else if (!value || value.length < 2) {
                return;
            } else {
                searchQuery.searchTerm = value;
            }

            searchNodes(searchQuery)
                .then(result => result.text())
        .then(result => {
                const d = document.createElement('div');
            d.innerHTML = result;
            const nodes = d.querySelector('.nodes');

            return Array.prototype.map.call(nodes.querySelectorAll('.node'), node => ({
                    label: node.querySelector('.node-label').innerText,
                    value: node.querySelector('.node-identifier').innerText
                }));
        })
        .then(optionsForForm => {
                callback(optionsForForm);
        });
        };

        return <SelectBox options={options} value={this.props.value} onSelect={commit}/>;
    }
}
