import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    commenceNodeRemoval: actions.CR.Nodes.commenceRemoval
})
export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        className: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        canBeDeleted: PropTypes.bool.isRequired,
        commenceNodeRemoval: PropTypes.func.isRequired
    };

    handleDeleteSelectedNodeClick = () => {
        const {contextPath, commenceNodeRemoval, canBeDeleted} = this.props;

        if (canBeDeleted) {
            commenceNodeRemoval(contextPath);
        }
    }

    render() {
        const {className, destructiveOperationsAreDisabled, canBeDeleted} = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={destructiveOperationsAreDisabled || !canBeDeleted}
                onClick={this.handleDeleteSelectedNodeClick}
                icon="trash"
                hoverStyle="clean"
                />
        );
    }
}
