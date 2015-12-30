import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {SideBar} from '../../Components/';
import NodeTreeToolBar from './NodeTreeToolBar/';
import style from './style.css';
import {immutableOperations} from '../../../Shared/Util';

const {$get} = immutableOperations;

@connect(state => ({
    isHidden: $get(state, 'ui.leftSidebar.isHidden')
}))
export default class LeftSideBar extends Component {
    static propTypes = {
        isHidden: PropTypes.bool.isRequired
    }

    render() {
        const classNames = mergeClassNames({
            [style.leftSideBar]: true,
            [style['leftSideBar--isHidden']]: this.props.isHidden
        });

        return (
            <SideBar position="left" className={classNames}>
                <NodeTreeToolBar />
                This is sparta!
            </SideBar>
        );
    }
}
