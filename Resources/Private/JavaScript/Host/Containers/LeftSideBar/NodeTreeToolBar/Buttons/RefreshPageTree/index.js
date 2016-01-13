import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButton} from 'Host/Components/';

@connect()
export default class RefreshPageTree extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    render() {
        return (
            <IconButton
                className={this.props.className}
                onClick={this.refreshPageTree.bind(this)}
                icon="refresh"
                hoverStyle="clean"
                />
        );
    }

    refreshPageTree() {
        console.log('refresh page tree');
    }
}
