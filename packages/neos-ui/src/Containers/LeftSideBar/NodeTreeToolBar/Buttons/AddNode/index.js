import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

@connect($transform({
    focusedNode: $get('ui.pageTree.isFocused')
}), {
    openAddNodeModal: actions.UI.AddNodeModal.open
})
export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string,
        openAddNodeModal: PropTypes.func.isRequired,
        focusedNode: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOpenModalBtnClick = this.handleOpenModalBtnClick.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        return (
            <span>
                <IconButton
                    className={this.props.className}
                    icon="plus"
                    onClick={this.handleOpenModalBtnClick}
                    onItemSelect={this.handleInsertModeChanged}
                    />
            </span>
        );
    }

    handleOpenModalBtnClick() {
        const {
            openAddNodeModal,
            focusedNode
        } = this.props;

        openAddNodeModal(focusedNode, 'insert');
    }
}
