import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {immutableOperations} from 'Shared/Utilities/';
import {SideBar} from 'Host/Components/';
import NodeTreeToolBar from './NodeTreeToolBar/';
import PageTree from './PageTree/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.leftSideBar.isHidden') || $get(state, 'ui.fullScreen.isFullScreen')
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
