import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class CutSelectedNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    }

    render() {
        const {
            isDisabled,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                onClick={this.cutSelectedNode.bind(this)}
                icon="cut"
                hoverStyle="clean"
                />
        );
    }

    cutSelectedNode() {
        console.log('cut selected node');
    }
}
CutSelectedNode.defaultProps = {
    isDisabled: true
};
