import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class CutSelectedNode extends Component {
    render() {
        return (
            <IconButton icon="cut" onClick={this.cutSelectedNode.bind(this)} hoverStyle="clean" />
        );
    }

    cutSelectedNode() {
        console.log('cut selected node');
    }
}
