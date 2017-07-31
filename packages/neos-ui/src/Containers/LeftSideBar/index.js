import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get, $or} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';

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
                <div className={style.leftSideBar__top}>
                    <PageTreeToolbar/>
                    <PageTree/>
                </div>

                <hr/>

                <ToggablePanel isOpen={true} closesToBottom={true}>
                    <ToggablePanel.Header noPadding={true}>
                        <ContentTreeToolbar/>
                    </ToggablePanel.Header>
                    <ToggablePanel.Contents noPadding={true}>
                        <ContentTree/>
                    </ToggablePanel.Contents>
                </ToggablePanel>
            </SideBar>
        );
    }
}
