import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {$transform, $get, $or} from 'plow-js';

import {SideBar} from 'Components/index';

import NodeTreeToolBar from './NodeTreeToolBar/index';
import PageTree from './PageTree/index';
import style from './style.css';

@connect($transform({
    isHidden: $or(
        $get('ui.leftSideBar.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    )
}))
export default class LeftSideBar extends Component {
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
                id="neos__leftSidebar"
                aria-hidden={isHidden ? 'true' : 'false'}
                >
                <NodeTreeToolBar />
                <PageTree />
            </SideBar>
        );
    }
}
