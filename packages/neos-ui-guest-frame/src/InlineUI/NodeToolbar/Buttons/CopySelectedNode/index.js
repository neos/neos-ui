import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    copyNode: actions.CR.Nodes.copy
})
export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        contextPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        copyNode: PropTypes.func.isRequired
    };

    handleCopySelectedNodeClick = () => {
        const {contextPath, copyNode} = this.props;

        copyNode(contextPath);
    }

    render() {
        const {destructiveOperationsAreDisabled, className, isActive} = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={destructiveOperationsAreDisabled}
                isActive={isActive}
                onClick={this.handleCopySelectedNodeClick}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }
}
