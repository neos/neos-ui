import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {
    SideBar,
    Tabs,
    IconButton,
    TextInput,
    ToggablePanel
} from 'Host/Components/';
import {actions} from 'Host/Redux/';
import {immutableOperations} from 'Shared/Util/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.rightSidebar.isHidden')
}))
export default class RightSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        dispatch: PropTypes.any.isRequired
    }

    render() {
        const {isHidden} = this.props;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isHidden
        });
        const toggleIcon = isHidden ? 'chevron-left' : 'chevron-right';

        return (
            <SideBar position="right" className={classNames}>
                <Tabs>
                    <Tabs.Panel icon="pencil">
                        <ToggablePanel
                            className={style.rightSideBar__section}
                            title="My fancy configuration"
                            >
                            <TextInput
                                label="Title"
                                placeholder="Type to search"
                                />
                        </ToggablePanel>

                    </Tabs.Panel>
                    <Tabs.Panel icon="cog">
                        <p>Content #2 here</p>
                    </Tabs.Panel>
                    <Tabs.Panel icon="bullseye">
                        <p>Content #3 here</p>
                    </Tabs.Panel>
                </Tabs>

                <IconButton
                    icon={toggleIcon}
                    className={style.rightSideBar__toggleBtn}
                    onClick={this.toggleSidebar.bind(this)}
                    />
            </SideBar>
        );
    }

    toggleSidebar() {
        this.props.dispatch(actions.UI.RightSideBar.toggle());
    }
}
