import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect()
export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.handleCopySelectedNodeClick = this.copySelectedNode.bind(this);
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
                onClick={this.handleCopySelectedNodeClick}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }

    copySelectedNode() {
        console.log('copy selected node');
    }
}
