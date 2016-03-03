import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {
    SideBar,
    Tabs,
    IconButton,
    Label,
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
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle
})
export default class RightSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
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
              onClick={() => this.props.toggleSidebar()}
              id="neos__rightSideBar__toggler"
              />
        );

        return (
            <SideBar position="right" className={classNames} id="neos__rightSideBar">
                <Tabs>
                    <Tabs.Panel icon="pencil">
                        <ToggablePanel.Wrapper className={style.rightSideBar__section}>
                            <ToggablePanel.Header>
                                My fancy configuration
                            </ToggablePanel.Header>
                            <ToggablePanel.Contents>
                                <Label label="Title" htmlFor="testInput" />
                                <TextInput placeholder="Type to search" id="testInput" />
                            </ToggablePanel.Contents>
                        </ToggablePanel.Wrapper>
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
}
