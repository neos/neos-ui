import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class DeleteSelectedNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    render() {
        return (
            <IconButton
                className={this.props.className}
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
