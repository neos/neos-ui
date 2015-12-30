import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from '../../../../../Components/';

@connect()
export default class HideSelectedNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    render() {
        return (
            <IconButton
                className={this.props.className}
                onClick={this.hideSelectedNode.bind(this)}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }

    hideSelectedNode() {
        console.log('hide selected node');
    }
}
