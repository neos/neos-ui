import React, {Component, PropTypes} from 'react';
import {
    IconButtonDropDown,
    Icon
} from 'Components/index';

export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string
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
                    onClick={() => console.log(`${this.state.currentMode} node`)}
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

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }
}
