import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from 'Host/Components/';

@connect()
export default class DeleteSelectedNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    render() {
        const {
            isDisabled,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                onClick={this.deleteSelectedNode.bind(this)}
                icon="trash"
                hoverStyle="clean"
                />
        );
    }

    deleteSelectedNode() {
        console.log('delete selected node');
    }
}
DeleteSelectedNode.defaultProps = {
    isDisabled: true
};
