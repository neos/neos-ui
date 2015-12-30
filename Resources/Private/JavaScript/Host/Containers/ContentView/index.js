import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import style from './style.css';
import {immutableOperations} from '../../../Shared/Util';

const {$get} = immutableOperations;


@connect(state => ({
    tabs: $get(state, 'ui.tabs')
}))
export default class ContentView extends Component {
    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map)
    };

    render() {
        const activeId = $get(this.props.tabs, 'active.id');

        // Using Maps as children is not yet fully supported in react 0.14.1.
        const tabs = $get(this.props.tabs, 'byId');

        return (
            <div className={style.contentView}>
                {tabs.map(tab => this.renderTab(tab, activeId)).toArray()}
            </div>
        );
    }

    renderTab(tab, activeId) {
        const tabClasses = mergeClassNames({
            [style.contentView__item]: true,
            [style['contentView__item--active']]: tab.get('id') === activeId
        });

        return <iframe src={tab.get('src')} frameBorder="0" name={tab.get('id')} key={tab.get('id')}
            data-context-path={tab.get('contextPath')} className={tabClasses} />;
    }
}
