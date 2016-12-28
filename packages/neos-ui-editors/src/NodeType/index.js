import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@connect($transform({
    getAllowedSiblingNodeTypesForFocusedNode: selectors.CR.Nodes.getAllowedSiblingNodeTypesForFocusedNodeSelector
}))
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class NodeType extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        commit: PropTypes.func.isRequired,

        getAllowedSiblingNodeTypesForFocusedNode: PropTypes.func,
        nodeTypesRegistry: PropTypes.object,
        translate: PropTypes.func.isRequired
    }

    render() {
        const {value, commit, nodeTypesRegistry, getAllowedSiblingNodeTypesForFocusedNode, translate} = this.props;
        const options = getAllowedSiblingNodeTypesForFocusedNode(nodeTypesRegistry)
            // Filter out system nodetypes (i.e. without groups)
            // ToDo: move this logic to some more generic place, maybe nodeTypesRegistry
            .filter(nodeType => $get('ui.group', nodeTypesRegistry.get(nodeType)))
            .map(nodeType => ({
                icon: $get('ui.icon', nodeTypesRegistry.get(nodeType)),
                label: translate($get('ui.label', nodeTypesRegistry.get(nodeType))) || nodeType,
                value: nodeType
            }));

        if (options.length) {
            return <SelectBox options={options} value={value} onSelect={commit}/>;
        }

        return (
            <div className={style.noOptionsAvailable}>
                {translate($get('ui.label', nodeTypesRegistry.get(value)))}
            </div>
        );
    }
}
