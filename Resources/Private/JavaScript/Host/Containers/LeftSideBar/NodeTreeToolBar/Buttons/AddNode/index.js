import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButtonDropDown, Icon} from '../../../../../Components/';

@connect()
export default class AddNode extends Component {
    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.state = {currentMode: 'insert'};
    }

    render() {
        const {currentMode} = this.state;
        let modeIcon;

        switch (currentMode) {
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

        return (
            <IconButtonDropDown
                icon="plus"
                modeIcon={modeIcon}
                onClick={this.openAddNodeDialog.bind(this)}
                onItemSelect={this.onModeChanged.bind(this)}
                >
                <Icon ref="prepend" icon="long-arrow-up" />
                <Icon ref="insert" icon="long-arrow-right" />
                <Icon ref="append" icon="long-arrow-down" />
            </IconButtonDropDown>
        );
    }

    openAddNodeDialog() {
        console.log('open add node dialog');
    }

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }
}
