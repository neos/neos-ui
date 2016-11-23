import React, {PureComponent, PropTypes} from 'react';
import IconButtonDropDown from '@neos-project/react-ui-components/lib/IconButtonDropDown/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

export default class PasteClipBoardNode extends PureComponent {
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
