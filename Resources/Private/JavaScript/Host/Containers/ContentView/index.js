import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import style from './style.css';
import {immutableOperations} from 'Shared/Utilities/';

const {$get} = immutableOperations;

@connect(state => ({
    tabs: $get(state, 'ui.tabs'),
    isFringeLeft: $get(state, 'ui.leftSideBar.isHidden'),
    isFringeRight: $get(state, 'ui.rightSideBar.isHidden'),
    isFullScreen: $get(state, 'ui.fullScreen.isFullScreen')
}))
export default class ContentView extends Component {
    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map),
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired
    };

    render() {
        const {isFringeLeft, isFringeRight, isFullScreen} = this.props;
        const activeId = $get(this.props.tabs, 'active.id');

        // Using Maps as children is not yet fully supported in react 0.14.1.
        const tabs = $get(this.props.tabs, 'byId');

        const classNames = mergeClassNames({
            [style.contentView]: true,
            [style['contentView--isFringeLeft']]: isFringeLeft,
            [style['contentView--isFringeRight']]: isFringeRight,
            [style['contentView--isFullScreen']]: isFullScreen
        });

        return (
            <div className={classNames}>
                {tabs.map(tab => this.renderTab(tab, activeId)).toArray()}
            </div>
        );
    }

    renderTab(tab, activeId) {
        const tabClasses = mergeClassNames({
            [style.contentView__item]: true,
            [style['contentView__item--active']]: tab.get('id') === activeId
        });

        return (
            <iframe
                src={tab.get('src')}
                frameBorder="0"
                name={tab.get('id')}
                key={tab.get('id')}
                data-context-path={tab.get('contextPath')}
                className={tabClasses}
                />
        );
    }
}
