import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';

import backend from '@neos-project/neos-ui-backend-connector';

@connect($transform({
    activeWorkspace: $get('cr.workspaces.personalWorkspace.name'),
    siteNodePath: $get('cr.nodes.siteNode')
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('@neos-project/neos-ui-i18n')
}))
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any,

        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string)
        }),

        activeWorkspace: PropTypes.string.isRequired,
        siteNodePath: PropTypes.string.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.searchNodes = backend.get().endpoints.searchNodes;
        this.handleDelete = () => this.props.commit('');
    }

    render() {
        const {commit, options, i18nRegistry} = this.props;
        const valueSoFar = this.props.value;

        const selectBoxOptions = ({value, callback}) => {
            const searchQuery = {
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

            this.searchNodes(searchQuery).then(result => {
                callback(result);
            });
        };

        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const onDelete = this.props.value ? this.handleDelete : null;

        return <SelectBox options={selectBoxOptions} value={this.props.value} onSelect={commit} onDelete={onDelete} placeholder={placeholder}/>;
    }
}
