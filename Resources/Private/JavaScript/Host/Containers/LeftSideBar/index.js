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
    isHidden: $get(state, 'ui.leftSideBar.isHidden'),
    isFullScreen: $get(state, 'ui.fullScreen.isFullScreen')
}))
export default class LeftSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired
    };

    render() {
        const classNames = mergeClassNames({
            [style.leftSideBar]: true,
            [style['leftSideBar--isHidden']]: this.props.isHidden,
            [style['leftSideBar--isFullScreen']]: this.props.isFullScreen
        });

        return (
            <SideBar position="left" className={classNames}>
                <NodeTreeToolBar />
                <PageTree />
            </SideBar>
        );
    }
}
