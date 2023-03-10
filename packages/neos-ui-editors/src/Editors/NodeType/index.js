import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.module.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect((state, {nodeTypesRegistry}) => {
    const getAllowedSiblingNodeTypes = selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry);

    return state => {
        const focusedNode = selectors.CR.Nodes.focusedSelector(state);
        const focusedNodeContextPath = focusedNode?.contextPath;
        const allowedSiblingNodeTypesForFocusedNode = getAllowedSiblingNodeTypes(state, {
            subject: focusedNodeContextPath,
            reference: focusedNodeContextPath
        });
        const isSiteNode = state?.cr?.nodes?.siteNode === focusedNodeContextPath;

        return {focusedNode, allowedSiblingNodeTypesForFocusedNode, isSiteNode};
    };
})
export default class NodeType extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.string.isRequired,
        commit: PropTypes.func.isRequired,
        options: PropTypes.object,

        isSiteNode: PropTypes.bool,
        focusedNode: PropTypes.object,
        allowedSiblingNodeTypesForFocusedNode: PropTypes.array,
        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    }

    renderNoOptionsAvailable() {
        const {value, nodeTypesRegistry, i18nRegistry, className} = this.props;

        const classNames = mergeClassNames({
            [className]: true,
            [style.noOptionsAvailable]: true
        });

        return (
            <div className={classNames}>
                {i18nRegistry.translate(nodeTypesRegistry.get(value)?.ui?.label)}
            </div>
        );
    }

    render() {
        const {value, className, commit, nodeTypesRegistry, allowedSiblingNodeTypesForFocusedNode, i18nRegistry, focusedNode, isSiteNode} = this.props;
        const disabled = this.props?.options?.disabled;

        // Auto-created child nodes cannot change type
        if (focusedNode?.isAutoCreated === true) {
            return this.renderNoOptionsAvailable();
        }

        // Show all nodetypes if is site root node
        const nodeTypeFilter = isSiteNode ? nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document')) : allowedSiblingNodeTypesForFocusedNode;
        const nodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(nodeTypeFilter).reduce((result, group) => {
            group.nodeTypes.forEach(nodeType => {
                result.push({
                    icon: nodeType?.ui?.icon,
                    label: i18nRegistry.translate(nodeType.label) || nodeType.name,
                    value: nodeType.name,
                    group: i18nRegistry.translate(group.label)
                });
            });
            return result;
        }, []);

        if (nodeTypes.length) {
            return <SelectBox className={className} options={nodeTypes} disabled={disabled} value={value} onValueChange={commit}/>;
        }

        return this.renderNoOptionsAvailable();
    }
}
