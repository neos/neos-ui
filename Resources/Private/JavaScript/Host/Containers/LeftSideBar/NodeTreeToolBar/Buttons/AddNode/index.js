import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    IconButtonDropDown,
    Icon,
    Dialog,
    Headline,
    Button,
    Grid,
    GridItem,
    I18n
} from '../../../../../Components/';
import style from './style.css';

@connect()
export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    constructor(props) {
        super(props);

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
        const dummyNodeTypes = [{
            icon: 'font',
            title: 'Headline'
        }, {
            icon: 'file-text',
            title: 'Text'
        }, {
            icon: 'picture-o',
            title: 'Image'
        }, {
            icon: 'picture-o',
            title: 'Text with Image'
        }].map(nodeType => {
            nodeType.onClick = () => {
                console.log('Create NodeType:', nodeType);
            };

            return nodeType;
        });

        return (
            <Dialog
                isOpen={this.state.isModalOpen}
                onRequestClose={this.closeAddNodeDialog.bind(this)}
                actions={actions}
                >
                <Headline type="h1">
                    <I18n fallback="Create new" id="createNew" />
                </Headline>

                <Grid>
                    {dummyNodeTypes.map((nodeType, index) => {
                        const {
                            icon,
                            title,
                            onClick
                        } = nodeType;

                        return (
                            <GridItem width="33%" key={index}>
                                <Button
                                    className={style.nodeType}
                                    hoverStyle="brand"
                                    onClick={onClick}
                                    >
                                    <Icon icon={icon} className={style.nodeType__icon} padded="right" />
                                    <I18n fallback={title} />
                                </Button>
                            </GridItem>
                        );
                    })}
                </Grid>
            </Dialog>
        );
    }
}
