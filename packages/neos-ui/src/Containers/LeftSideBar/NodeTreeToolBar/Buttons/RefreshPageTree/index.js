import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect(null, {
    onClick: actions.UI.PageTree.reloadTree
})
export default class RefreshPageTree extends Component {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleClick = () => this.props.onClick(this.props.nodeTypesRegistry);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        return (
            <IconButton
                className={this.props.className}
                onClick={this.handleClick}
                icon="refresh"
                hoverStyle="clean"
                />
        );
    }
}
