import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButtonDropDown, Icon} from '../../../../../Components/';

@connect()
export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.state = {currentMode: 'insert'};
    }

    render() {
        const modeIcon = this.getCurrentModeIcon();

        return (
            <IconButtonDropDown
                className={this.props.className}
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

    openAddNodeDialog() {
        console.log('open add node dialog');
    }

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }
}
