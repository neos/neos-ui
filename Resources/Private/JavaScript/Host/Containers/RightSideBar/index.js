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
import {immutableOperations} from 'Shared/Utilities/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.rightSideBar.isHidden'),
    isFullScreen: $get(state, 'ui.fullScreen.isFullScreen')
}))
export default class RightSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        dispatch: PropTypes.any.isRequired
    };

    render() {
        const {isHidden, isFullScreen} = this.props;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isHidden || isFullScreen
        });
        const toggleIcon = isHidden ? 'chevron-left' : 'chevron-right';
        const toggle = isFullScreen ? null : (
          <IconButton
              icon={toggleIcon}
              className={style.rightSideBar__toggleBtn}
              onClick={this.toggleSidebar.bind(this)}
              id="neos__rightSideBar__toggler"
              />
        );

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

                {toggle}
            </SideBar>
        );
    }

    toggleSidebar() {
        this.props.dispatch(actions.UI.RightSideBar.toggle());
    }
}
