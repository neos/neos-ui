import React, {Component, PropTypes} from 'react';
import {IconButton} from 'Components/index';

export default class CopySelectedNode extends Component {
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
                onClick={this.copySelectedNode.bind(this)}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }

    copySelectedNode() {
        console.log('copy selected node');
    }
}
