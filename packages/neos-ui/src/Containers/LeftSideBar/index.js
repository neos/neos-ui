import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get, $or} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';

import SideBar from '@neos-project/react-ui-components/src/SideBar/';
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
    siteNode: selectors.CR.Nodes.siteNodeSelector,
    documentNode: selectors.UI.ContentCanvas.documentNodeSelector
}))
export default class LeftSideBar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,

        isHidden: PropTypes.bool.isRequired
    };

    render() {
        const {isHidden, containerRegistry} = this.props;

        const classNames = mergeClassNames({
            [style.leftSideBar]: true,
            [style['leftSideBar--isHidden']]: isHidden
        });

        const PageTreeToolbar = containerRegistry.get('LeftSideBar/PageTreeToolbar');
        const PageTree = containerRegistry.get('LeftSideBar/PageTree');
        const ContentTreeToolbar = containerRegistry.get('LeftSideBar/ContentTreeToolbar');
        const ContentTree = containerRegistry.get('LeftSideBar/ContentTree');

        return (
            <SideBar
                position="left"
                className={classNames}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                <PageTreeToolbar/>
                <PageTree/>
                <hr/>
                <ContentTreeToolbar/>
                <ContentTree/>
            </SideBar>
        );
    }
}
