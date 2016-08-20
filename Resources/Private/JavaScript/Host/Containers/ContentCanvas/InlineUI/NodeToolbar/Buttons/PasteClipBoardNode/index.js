import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {IconButtonDropDown, Icon} from 'Components/index';

export default class PasteClipBoardNode extends Component {
    static propTypes = {
        isDisabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        isDisabled: true
    };

    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.handlePasteButtonClick = this.pasteClipBoardNode.bind(this);
        this.handlePasteButtonModeChange = this.changePasteBoardMode.bind(this);
        this.state = {currentMode: 'insert'};
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
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
                onClick={this.handlePasteButtonClick}
                onItemSelect={this.handlePasteButtonModeChange}
                >
                <Icon dropDownId="prepend" icon="long-arrow-up"/>
                <Icon dropDownId="insert" icon="long-arrow-right"/>
                <Icon dropDownId="append" icon="long-arrow-down"/>
            </IconButtonDropDown>
        );
    }

    pasteClipBoardNode() {
        console.log('paste clipboard node');
    }

    changePasteBoardMode(currentMode) {
        this.setState({
            currentMode
        });
    }
}
