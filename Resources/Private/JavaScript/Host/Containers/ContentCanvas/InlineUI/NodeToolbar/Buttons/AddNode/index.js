import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    IconButtonDropDown,
    Icon
} from 'Components/index';
import {actions} from 'Host/Redux/index';
import {$transform} from 'plow-js';

@connect($transform({
}), {
    open: actions.UI.AddNodeModal.open
})
export default class AddNode extends Component {
    static propTypes = {
        node: PropTypes.object,
        className: PropTypes.string,
        open: PropTypes.func.isRequired
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
                    onClick={this.openModal.bind(this)}
                    onItemSelect={this.onModeChanged.bind(this)}
                    directButtonProps={directButtonProps}
                    >
                    <Icon dropDownId="prepend" icon="level-up" />
                    <Icon dropDownId="insert" icon="long-arrow-right" />
                    <Icon dropDownId="append" icon="level-down" />
                </IconButtonDropDown>
            </span>
        );
    }

    openModal() {
        this.props.open(this.props.node.contextPath, this.state.currentMode);
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
