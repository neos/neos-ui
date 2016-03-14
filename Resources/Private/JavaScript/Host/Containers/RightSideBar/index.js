import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {CR} from 'Host/Selectors/index';

import {
    SideBar,
    Tabs,
    IconButton
} from 'Host/Components/index';
import {actions} from 'Host/Redux/index';

import style from './style.css';

import Inspector from './Inspector/index';

const generateTabs = (nodeType) => {
    const tabs = nodeType.ui.inspector.tabs;
    return Object.keys(tabs).map(tabId => ({
        ...tabs[tabId],
        id: tabId
    })).sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderTab = (tab, focusedNode) => {
    return (
        <Inspector.TabPanel
            tab={tab}
            focusedNode={focusedNode}
            key={tab.id}
            icon={tab.icon}
            />
    );
};

@connect($transform({
    isHidden: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    focusedNode: CR.Nodes.focusedSelector
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle
})
export default class RightSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired,
        focusedNode: PropTypes.object.isRequired
    };

    render() {
        const tabs = generateTabs(this.props.focusedNode.nodeType);
        const {isHidden, isFullScreen} = this.props;
        const isSideBarHidden = isHidden || isFullScreen;
        const classNames = mergeClassNames({
            [style.rightSideBar]: true,
            [style['rightSideBar--isHidden']]: isSideBarHidden
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
            <SideBar
                position="right"
                className={classNames}
                id="neos__rightSideBar"
                aria-hidden={isSideBarHidden ? 'true' : 'false'}
                >
                <Tabs>
                    {tabs.map(tab => renderTab(tab, this.props.focusedNode))}
                </Tabs>

                {toggle}
            </SideBar>
        );
    }
}
