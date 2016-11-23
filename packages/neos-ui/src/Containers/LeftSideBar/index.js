import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get, $or} from 'plow-js';
import SideBar from '@neos-project/react-ui-components/lib/SideBar/';

import NodeTreeToolBar from './NodeTreeToolBar/index';
import PageTree from './PageTree/index';
import style from './style.css';

@connect($transform({
    isHidden: $or(
        $get('ui.leftSideBar.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    )
}))
export default class LeftSideBar extends PureComponent {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired
    };

    render() {
        const {isHidden} = this.props;
        const classNames = mergeClassNames({
            [style.leftSideBar]: true,
            [style['leftSideBar--isHidden']]: isHidden
        });

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
