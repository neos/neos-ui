import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import SideBar from '@neos-project/react-ui-components/src/SideBar/';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    isHidden: $get('ui.leftSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    isHiddenContentTree: $get('ui.leftSideBar.contentTree.isHidden'),
    siteNode: selectors.CR.Nodes.siteNodeSelector,
    documentNode: selectors.CR.Nodes.documentNodeSelector
}), {
    toggleSidebar: actions.UI.LeftSideBar.toggle
})
export default class LeftSideBar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,

        isHidden: PropTypes.bool.isRequired,
        isHiddenContentTree: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired
    };

    handleToggle = () => {
        const {toggleSidebar} = this.props;

        toggleSidebar();
    }

    render() {
        const {isHidden, isFullScreen, isHiddenContentTree, containerRegistry, i18nRegistry} = this.props;

        const classNames = mergeClassNames({
            [style.leftSideBar]: true,
            [style['leftSideBar--isHidden']]: isHidden || isFullScreen
        });

        const bottomClassNames = mergeClassNames({
            [style.leftSideBar__bottom]: true,
            [style['leftSideBar__bottom--isCollapsed']]: isHiddenContentTree
        });

        const LeftSideBarTop = containerRegistry.getChildren('LeftSideBar/Top');
        const LeftSideBarBottom = containerRegistry.getChildren('LeftSideBar/Bottom');

        const ContentTreeToolbar = containerRegistry.get('LeftSideBar/ContentTreeToolbar');

        const toggleIcon = isHidden ? 'chevron-circle-right' : 'chevron-circle-left';
        const toggle = isFullScreen ? null : (
            <IconButton
                id="neos-LeftSideBarToggler"
                icon={toggleIcon}
                className={style.leftSideBar__toggleBtn}
                hoverStyle="clean"
                title={i18nRegistry.translate('Neos.Neos:Main:navigate')}
                />
        );

        return (
            <SideBar
                position="left"
                className={classNames}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                <div role="button" className={style.leftSideBar__header} onClick={this.handleToggle}>
                    {toggle}
                    {i18nRegistry.translate('Neos.Neos:Main:documentTree', 'Document Tree')}
                </div>

                <div className={style.leftSideBar__top}>
                    {!isHidden && LeftSideBarTop.map((Item, key) => <Item key={key} isExpanded={!isHiddenContentTree}/>)}
                </div>

                <div className={bottomClassNames}>
                    <ContentTreeToolbar/>
                    {!isHidden && !isHiddenContentTree && LeftSideBarBottom.map((Item, key) => <Item key={key}/>)}
                </div>
            </SideBar>
        );
    }
}
