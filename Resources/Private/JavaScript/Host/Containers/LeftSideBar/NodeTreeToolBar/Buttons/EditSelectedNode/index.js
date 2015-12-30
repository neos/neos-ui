import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class EditSelectedNode extends Component {
    render() {
        return (
            <IconButton icon="pencil" onClick={this.editSelectedNode.bind(this)} hoverStyle="clean" />
        );
    }

    editSelectedNode() {
        console.log('edit selected node');
    }
}
