import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from 'Host/Components/index';

@connect()
export default class EditSelectedNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
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
                onClick={this.editSelectedNode.bind(this)}
                icon="pencil"
                hoverStyle="clean"
                />
        );
    }

    editSelectedNode() {
        console.log('edit selected node');
    }
}
