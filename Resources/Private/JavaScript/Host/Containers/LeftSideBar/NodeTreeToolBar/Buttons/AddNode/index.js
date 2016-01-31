import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {backend} from 'Host/Service/';
import {
    IconButtonDropDown,
    Icon,
    Dialog,
    Headline,
    Button,
    Grid,
    GridItem,
    I18n
} from 'Host/Components/';
import {activePageTreeNodeSelector} from 'Host/Selectors/activePageTreeNodeSelector';
import style from './style.css';

@connect(state => ({
    activePageTreeNode: activePageTreeNodeSelector(state)
}))
export default class AddNode extends Component {
    static propTypes = {
        className: PropTypes.string,
        activePageTreeNode: PropTypes.object
    };

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
                    <Icon dropDownId="prepend" icon="long-arrow-up" />
                    <Icon dropDownId="insert" icon="long-arrow-right" />
                    <Icon dropDownId="append" icon="long-arrow-down" />
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
        const {changeManager} = backend;
        let changeType;
        switch (this.state.currentMode) {
            case 'prepend':
                changeType = 'PackageFactory.Guevara:CreateBefore';
                break;
            case 'append':
                changeType = 'PackageFactory.Guevara:CreateAfter';
                break;
            default:
                changeType = 'PackageFactory.Guevara:Create';
                break;
        }
        const contextPath = this.props.activePageTreeNode.get('contextPath');
        const dummyNodeTypes = [{
            icon: 'file-text',
            title: 'Page',
            nodeType: 'TYPO3.Neos.NodeTypes:Page'
        }].map(nodeType => {
            nodeType.onClick = () => {
                changeManager.commitChange({
                    type: changeType,
                    subject: contextPath,
                    payload: {
                        nodeType: nodeType.nodeType,
                        initialProperties: {
                            title: 'test'
                        }
                    }
                });
                this.closeAddNodeDialog();
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
