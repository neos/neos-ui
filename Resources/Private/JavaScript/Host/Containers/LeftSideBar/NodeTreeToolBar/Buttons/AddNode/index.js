import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    IconButtonDropDown,
    Icon,
    Dialog,
    Button,
    I18n
} from '../../../../../Components/';

@connect()
export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.state = {
            isModalOpen: false,
            currentMode: 'insert'
        };
    }

    render() {
        const modeIcon = this.getCurrentModeIcon();
        const modal = this.state.isModalOpen ? this.renderModal() : null;

        return (
            <span>
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
                {modal}
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

    openAddNodeDialog() {
        this.setState({
            isModalOpen: true
        });
    }

    closeAddNodeDialog() {
        this.setState({
            isModalOpen: false
        });
    }

    onModeChanged(currentMode) {
        this.setState({
            currentMode
        });
    }

    renderModal() {
        const actions = [
            <Button
                style="clean"
                hoverStyle="brand"
                onClick={this.closeAddNodeDialog.bind(this)}
                isFocused={true}
                >
                <I18n fallback="Cancel" />
            </Button>
        ];

        return (
            <Dialog
                isOpen={this.state.isModalOpen}
                title="Create new"
                onRequestClose={this.closeAddNodeDialog.bind(this)}
                actions={actions}
                >
                test
            </Dialog>
        );
    }
}
