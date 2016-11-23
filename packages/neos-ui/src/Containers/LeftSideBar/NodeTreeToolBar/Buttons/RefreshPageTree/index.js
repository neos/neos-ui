import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect()
export default class RefreshPageTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleRefreshClick = this.refreshPageTree.bind(this);
    }

    render() {
        return (
            <IconButton
                className={this.props.className}
                onClick={this.handleRefreshClick}
                icon="refresh"
                hoverStyle="clean"
                />
        );
    }

    refreshPageTree() {
        console.log('refresh page tree');
    }
}
