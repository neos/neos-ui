import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from 'Host/Redux/';
import {$transform, $get} from 'plow-js';
import {
    IconButtonDropDown,
    Icon
} from 'Host/Components/';

@connect($transform({
    focusedNode: $get('ui.pageTree.focused')
}), {
    open: actions.UI.AddNodeModal.open
})
export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string,
        open: PropTypes.func.isRequired,
        focusedNode: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            currentMode: 'insert'
        };
    }

    render() {
        const modeIcon = this.getCurrentModeIcon();
        const directButtonProps = {
            id: 'neos__leftSidebar__nodeTreeToolBar__addNode'
        };

        return (
            <span>
                <IconButtonDropDown
                    className={this.props.className}
                    icon="plus"
                    modeIcon={modeIcon}
                    onClick={this.onIconClick.bind(this)}
                    onItemSelect={this.onModeChanged.bind(this)}
                    directButtonProps={directButtonProps}
                    >
                    <Icon dropDownId="prepend" icon="long-arrow-up" />
                    <Icon dropDownId="insert" icon="long-arrow-right" />
                    <Icon dropDownId="append" icon="long-arrow-down" />
                </IconButtonDropDown>
            </span>
        );
    }

    getCurrentModeIcon() {
        let modeIcon;

        switch (this.state.currentMode) {
            case 'prepend':
                modeIcon = 'long-arrow-up';
                break;
            case 'append':
                modeIcon = 'long-arrow-down';
                break;
            default:
                modeIcon = 'long-arrow-right';
                break;
        }

        return modeIcon;
    }

    onIconClick() {
        this.props.open(this.props.focusedNode, this.state.currentMode);
    }

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }
}
