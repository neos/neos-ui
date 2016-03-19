import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from 'Components/index';

@connect()
export default class HideSelectedNode extends Component {
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
                onClick={this.hideSelectedNode.bind(this)}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }

    hideSelectedNode() {
        console.log('hide selected node');
    }
}
