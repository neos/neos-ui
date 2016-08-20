import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect()
export default class RefreshPageTree extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleRefreshClick = this.refreshPageTree.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
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
