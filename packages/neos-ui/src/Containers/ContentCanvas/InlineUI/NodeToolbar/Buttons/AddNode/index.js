import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import IconButtonDropDown from '@neos-project/react-ui-components/lib/IconButtonDropDown/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import {actions} from '@neos-project/neos-ui-redux-store';
import {$transform} from 'plow-js';

@connect($transform({
}), {
    openAddNodeModal: actions.UI.AddNodeModal.open
})
export default class AddNode extends Component {
    static propTypes = {
        node: PropTypes.object,
        className: PropTypes.string,
        openAddNodeModal: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            currentMode: 'insert'
        };
        this.handleOpenModalBtnClick = this.openModal.bind(this);
        this.handleInsertModeChanged = this.onModeChanged.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState);
    }

    render() {
        const modeIcon = this.getCurrentModeIcon();

        return (
            <span>
                <IconButtonDropDown
                    className={this.props.className}
                    icon="plus"
                    modeIcon={modeIcon}
                    onClick={this.handleOpenModalBtnClick}
                    onItemSelect={this.handleInsertModeChanged}
                    >
                    <Icon dropDownId="prepend" icon="level-up"/>
                    <Icon dropDownId="insert" icon="long-arrow-right"/>
                    <Icon dropDownId="append" icon="level-down"/>
                </IconButtonDropDown>
            </span>
        );
    }

    openModal() {
        const {
            openAddNodeModal,
            node
        } = this.props;

        openAddNodeModal(node.contextPath, this.state.currentMode);
    }

    getCurrentModeIcon() {
        let modeIcon;

        switch (this.state.currentMode) {
            case 'prepend':
                modeIcon = 'level-up';
                break;
            case 'append':
                modeIcon = 'level-down';
                break;
            default:
                modeIcon = 'long-arrow-right';
                break;
        }

        return modeIcon;
    }

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }
}
