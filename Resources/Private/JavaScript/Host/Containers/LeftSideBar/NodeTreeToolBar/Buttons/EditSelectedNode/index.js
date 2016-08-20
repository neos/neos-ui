import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {IconButton} from 'Components/index';

@connect()
export default class EditSelectedNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.handleEditSelectedNodeClick = this.editSelectedNode.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
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
                onClick={this.handleEditSelectedNodeClick}
                icon="pencil"
                hoverStyle="clean"
                />
        );
    }

    editSelectedNode() {
        console.log('edit selected node');
    }
}
