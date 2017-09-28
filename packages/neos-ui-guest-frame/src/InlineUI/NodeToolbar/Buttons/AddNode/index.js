import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const hasAnyNodeTypeOptionsSelector = selectors.CR.Nodes.makeHasAnyNodeTypeOptionsSelector(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = $get('cr.nodes.focused.contextPath', state);
        const hasAnyNodeTypeOptions = hasAnyNodeTypeOptionsSelector(state, {
            reference: focusedNodeContextPath
        });

        return {
            hasAnyNodeTypeOptions
        };
    };
}, {
    commenceNodeCreation: actions.CR.Nodes.commenceCreation
})
export default class AddNode extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        className: PropTypes.string,
        commenceNodeCreation: PropTypes.func.isRequired,
        hasAnyNodeTypeOptions: PropTypes.bool
    };

    handleCommenceNodeCreation = () => {
        const {
            commenceNodeCreation,
            contextPath,
            fusionPath
        } = this.props;

        commenceNodeCreation(contextPath, fusionPath);
    }

    render() {
        const {hasAnyNodeTypeOptions} = this.props;

        return (
            <span>
                <IconButton
                    isDisabled={!hasAnyNodeTypeOptions}
                    className={this.props.className}
                    icon="plus"
                    onClick={this.handleCommenceNodeCreation}
                    hoverStyle="clean"
                    />
            </span>
        );
    }
}
