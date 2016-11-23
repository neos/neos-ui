import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect()
export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.handleSelectNodeClick = this.hideSelectedNode.bind(this);
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
                onClick={this.handleSelectNodeClick}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }

    hideSelectedNode() {
        console.log('hide selected node');
    }
}
