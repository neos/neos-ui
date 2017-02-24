import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get, $or} from 'plow-js';
import SideBar from '@neos-project/react-ui-components/lib/SideBar/';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    isHidden: $or(
        $get('ui.leftSideBar.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    )
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

        const NodeTreeToolBar = containerRegistry.get('LeftSideBar/NodeTreeToolBar');
        const PageTree = containerRegistry.get('LeftSideBar/PageTree');

        return (
            <SideBar
                position="left"
                className={classNames}
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                <NodeTreeToolBar/>
                <PageTree/>
            </SideBar>
        );
    }
}
