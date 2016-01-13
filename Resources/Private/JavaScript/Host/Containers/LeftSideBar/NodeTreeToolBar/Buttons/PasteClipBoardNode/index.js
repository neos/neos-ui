import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IconButtonDropDown, Icon} from 'Host/Components/';

@connect()
export default class PasteClipBoardNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.state = {currentMode: 'insert'};
    }

    render() {
        const {isDisabled, className} = this.props;
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

        return (
            <IconButtonDropDown
                isDisabled={isDisabled}
                className={className}
                icon="paste"
                modeIcon={modeIcon}
                onClick={this.pasteClipBoardNode.bind(this)}
                onItemSelect={this.onModeChanged.bind(this)}
                >
                <Icon dropDownId="prepend" icon="long-arrow-up" />
                <Icon dropDownId="insert" icon="long-arrow-right" />
                <Icon dropDownId="append" icon="long-arrow-down" />
            </IconButtonDropDown>
        );
    }

    pasteClipBoardNode() {
        console.log('paste clipboard node');
    }

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }
}
PasteClipBoardNode.defaultProps = {
    isDisabled: true
};
