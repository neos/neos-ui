import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect((state, {nodeTypesRegistry}) => {
    const getAllowedSiblingNodeTypes = selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry);

    return state => {
        const focusedNode = selectors.CR.Nodes.focusedSelector(state);
        const focusedNodeContextPath = $get('contextPath', focusedNode);
        const allowedSiblingNodeTypesForFocusedNode = getAllowedSiblingNodeTypes(state, {
            subject: focusedNodeContextPath,
            reference: focusedNodeContextPath
        });

        return {focusedNode, allowedSiblingNodeTypesForFocusedNode};
    };
})
export default class NodeType extends PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
        commit: PropTypes.func.isRequired,
        highlight: PropTypes.bool,

        focusedNode: PropTypes.object,
        allowedSiblingNodeTypesForFocusedNode: PropTypes.array,
        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    }

    renderNoOptionsAvailable() {
        const {value, nodeTypesRegistry, i18nRegistry} = this.props;

        return (
            <div className={style.noOptionsAvailable}>
                {i18nRegistry.translate($get('ui.label', nodeTypesRegistry.get(value)))}
            </div>
        );
    }

    render() {
        const {value, commit, nodeTypesRegistry, allowedSiblingNodeTypesForFocusedNode, i18nRegistry, highlight, focusedNode} = this.props;

        // auto-created child nodes cannot change type
        if ($get('isAutoCreated', focusedNode) === true) {
            return this.renderNoOptionsAvailable();
        }

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
            return <SelectBox options={options} highlight={highlight} value={value} onValueChange={commit}/>;
        }

        return this.renderNoOptionsAvailable();
    }
}
