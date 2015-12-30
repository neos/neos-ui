import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class CopySelectedNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    render() {
        return (
            <IconButton
                className={this.props.className}
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
