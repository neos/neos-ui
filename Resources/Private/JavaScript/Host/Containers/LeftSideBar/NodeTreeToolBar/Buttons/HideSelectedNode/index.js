import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class HideSelectedNode extends Component {
    render() {
        return (
            <IconButton icon="eye-slash" onClick={this.hideSelectedNode.bind(this)} hoverStyle="clean" />
        );
    }

    hideSelectedNode() {
        console.log('hide selected node');
    }
}
