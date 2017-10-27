import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    cutNode: actions.CR.Nodes.cut
})
export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        contextPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        cutNode: PropTypes.func.isRequired
    };

    handleCutSelectedNodeClick = () => {
        const {contextPath, cutNode} = this.props;

        cutNode(contextPath);
    }

    render() {
        const {
            destructiveOperationsAreDisabled,
            isActive,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isActive={isActive}
                isDisabled={destructiveOperationsAreDisabled}
                onClick={this.handleCutSelectedNodeClick}
                icon="cut"
                tooltipLabel="Cut"
                hoverStyle="clean"
                />
        );
    }
}
