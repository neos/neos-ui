import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class CopySelectedNode extends Component {
    render() {
        return (
            <IconButton icon="copy" onClick={this.copySelectedNode.bind(this)} hoverStyle="clean" />
        );
    }

    copySelectedNode() {
        console.log('copy selected node');
    }
}
