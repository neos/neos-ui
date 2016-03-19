import React, {Component, PropTypes} from 'react';
import {IconButton} from 'Components/index';

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
