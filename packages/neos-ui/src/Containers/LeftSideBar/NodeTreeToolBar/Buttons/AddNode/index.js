import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from '@neos-project/neos-ui-redux-store';
import {$transform, $get} from 'plow-js';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import IconButtonDropDown from '@neos-project/react-ui-components/lib/IconButtonDropDown/';

@connect($transform({
    focusedNode: $get('ui.pageTree.isFocused')
}), {
    openAddNodeModal: actions.UI.AddNodeModal.open
})
export default class AddNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        openAddNodeModal: PropTypes.func.isRequired,
        focusedNode: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            currentMode: 'insert'
        };
        this.handleAddNodeClick = this.openAddNodeModal.bind(this);
        this.handleInsertModeChanged = this.changeInsertMode.bind(this);
    }

    render() {
        const modeIcon = this.getCurrentModeIcon();

        return (
            <span>
                <IconButtonDropDown
                    className={this.props.className}
                    icon="plus"
                    modeIcon={modeIcon}
                    onClick={this.handleAddNodeClick}
                    onItemSelect={this.handleInsertModeChanged}
                    >
                    <Icon dropDownId="prepend" icon="level-up"/>
                    <Icon dropDownId="insert" icon="long-arrow-right"/>
                    <Icon dropDownId="append" icon="level-down"/>
                </IconButtonDropDown>
            </span>
        );
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

    openAddNodeModal() {
        const {
            openAddNodeModal,
            focusedNode
        } = this.props;

        openAddNodeModal(focusedNode, this.state.currentMode);
    }

    changeInsertMode(newMode) {
        this.setState({
            currentMode: newMode
        });
    }
}
