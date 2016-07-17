import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {
    SideBar,
    IconButton
} from 'Components/index';
import {actions} from 'Host/Redux/index';

import style from './style.css';

import Inspector from './Inspector/index';
//
// const generateTabs = (nodeType) => {
//     let tabs = $get('ui.inspector.tabs', nodeType);
//     tabs = (tabs && tabs.toJS ? tabs.toJS() : tabs);
//     return Object.keys(tabs).map(tabId => ({
//         ...tabs[tabId],
//         id: tabId
//     })).sort((a, b) => (a.position - b.position) || (a.id - b.id));
// };
//
// const renderTab = (tab) => {
//     return (<Inspector.TabPanel
//         tab={tab}
//         key={tab.id}
//         icon={tab.icon}
//         />
//     );
// };

@connect($transform({
    isHidden: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen')
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
        // const focusedNode = this.props.focusedNode;
        // const tabs = generateTabs($get('nodeType', focusedNode));
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

        /* eslint-disable no-inline-comments */
        return (
            <SideBar
                position="right"
                className={classNames}
                id="neos__rightSideBar"
                aria-hidden={isSideBarHidden ? 'true' : 'false'}
                >
                {toggle}
                <Inspector />
                {/*
                    <Tabs>
                        {tabs.map(tab => renderTab(tab))}
                    </Tabs>
                    <Bar position="bottom">
                        <Button onClick={() => this.props.inspectorApply(this.props.focusedNode.contextPath)}>
                            Apply Here
                        </Button>
                        <Button onClick={() => this.props.inspectorCancel(this.props.focusedNode.contextPath)}>
                            Revert
                        </Button>
                    </Bar>
                    */}
            </SideBar>
        );
        /* eslint-enable no-inline-comments */
    }
}
