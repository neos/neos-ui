import React, {Component, PropTypes} from 'react';
import {
    IconButtonDropDown,
    Icon
} from 'Components/index';

// TODO: hackish! What is the proper way to call `ui` methods?
//const {ui} = window.neos;
const ui = {}; // TODO!!!

export default class AddNode extends Component {
    static propTypes = {
        node: PropTypes.object,
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
        const {ui} = api.get();

        //
        // Fail-safe in case the API is not properly setup. (F.e. in unit tests or broken environments)
        //
        if (ui) {
            ui.openAddNodeModal(this.props.node.contextPath, this.state.currentMode);
        }
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
