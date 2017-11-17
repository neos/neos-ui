import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get, $or} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {actions} from '@neos-project/neos-ui-redux-store';

import SideBar from '@neos-project/react-ui-components/src/SideBar/';
import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    isHidden: $or(
        $get('ui.leftSideBar.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    ),
    isHiddenContentTree: $get('ui.leftSideBar.isHiddenContentTree'),
    // isHiddenContentTree: $get('ui.leftSideBar.isHidden'),
    siteNode: selectors.CR.Nodes.siteNodeSelector,
    documentNode: selectors.UI.ContentCanvas.documentNodeSelector
}), {
    toggleContentTree: actions.UI.LeftSideBar.toggleContentTree
})
export default class LeftSideBar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,

        isHidden: PropTypes.bool.isRequired,
        isHiddenContentTree: PropTypes.bool.isRequired,
        toggleContentTree: PropTypes.func.isRequired
    };

    toggleBottom = () => {
        const {toggleContentTree} = this.props;

        toggleContentTree();
    }

    render() {
        const {isHidden, isHiddenContentTree, containerRegistry} = this.props;

        const classNames = mergeClassNames({
            [style.leftSideBar]: true,
            [style['leftSideBar--isHidden']]: isHidden
        });

        const bottomClassNames = mergeClassNames({
            [style.leftSideBar__bottom]: true,
            [style['leftSideBar__bottom--isCollapsed']]: !isHiddenContentTree
        });

        const LeftSideBarTop = containerRegistry.getChildren('LeftSideBar/Top');
        const LeftSideBarBottom = containerRegistry.getChildren('LeftSideBar/Bottom');

        const ContentTreeToolbar = containerRegistry.get('LeftSideBar/ContentTreeToolbar');

        const openedIcon = 'chevron-down';
        const closedIcon = 'chevron-up';

        return (
            <SideBar
                position="left"
                className={classNames}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                <div className={style.leftSideBar__top}>
                    {LeftSideBarTop.map((Item, key) => <Item key={key} isExpanded={!isHiddenContentTree}/>)}
                </div>

                <hr/>

                <ToggablePanel className={bottomClassNames} onPanelToggle={this.toggleBottom} isOpen={isHiddenContentTree} closesToBottom={true}>
                    <ToggablePanel.Header noPadding={true} openedIcon={openedIcon} closedIcon={closedIcon}>
                        <ContentTreeToolbar/>
                    </ToggablePanel.Header>
                    <ToggablePanel.Contents noPadding={true}>
                        {LeftSideBarBottom.map((Item, key) => <Item key={key}/>)}
                    </ToggablePanel.Contents>
                </ToggablePanel>

            </SideBar>
        );
    }
}
