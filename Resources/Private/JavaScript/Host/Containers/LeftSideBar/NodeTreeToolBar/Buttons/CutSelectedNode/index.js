import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class CutSelectedNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    render() {
        return (
            <IconButton
                className={this.props.className}
                onClick={this.cutSelectedNode.bind(this)}
                icon="cut"
                hoverStyle="clean"
                />
        );
    }

    cutSelectedNode() {
        console.log('cut selected node');
    }
}
