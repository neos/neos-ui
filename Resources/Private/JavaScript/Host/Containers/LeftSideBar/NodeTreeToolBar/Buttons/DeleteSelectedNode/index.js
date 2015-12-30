import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class DeleteSelectedNode extends Component {
    render() {
        return (
            <IconButton icon="trash" onClick={this.deleteSelectedNode.bind(this)} hoverStyle="clean" />
        );
    }

    deleteSelectedNode() {
        console.log('delete selected node');
    }
}
