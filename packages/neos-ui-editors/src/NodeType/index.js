import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('@neos-project/neos-ui-i18n')
}))
@connect((state, {nodeTypesRegistry}) => {
    const getAllowedSiblingNodeTypes = selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = selectors.CR.Nodes.focusedNodePathSelector(state);
        const allowedSiblingNodeTypesForFocusedNode = getAllowedSiblingNodeTypes(state, {
            subject: focusedNodeContextPath,
            reference: focusedNodeContextPath
        });

        return {allowedSiblingNodeTypesForFocusedNode};
    };
})
export default class NodeType extends PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
        commit: PropTypes.func.isRequired,

        allowedSiblingNodeTypesForFocusedNode: PropTypes.array,
        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    }

    render() {
        const {value, commit, nodeTypesRegistry, allowedSiblingNodeTypesForFocusedNode, i18nRegistry} = this.props;
        const options = allowedSiblingNodeTypesForFocusedNode
            // Filter out system nodetypes (i.e. without groups)
            // ToDo: move this logic to some more generic place, maybe nodeTypesRegistry
            .filter(nodeType => $get('ui.group', nodeTypesRegistry.get(nodeType)))
            .map(nodeType => ({
                icon: $get('ui.icon', nodeTypesRegistry.get(nodeType)),
                label: i18nRegistry.translate($get('ui.label', nodeTypesRegistry.get(nodeType))) || nodeType,
                value: nodeType
            }));

        if (options.length) {
            return <SelectBox options={options} value={value} onSelect={commit}/>;
        }

        return (
            <div className={style.noOptionsAvailable}>
                {i18nRegistry.translate($get('ui.label', nodeTypesRegistry.get(value)))}
            </div>
        );
    }
}
