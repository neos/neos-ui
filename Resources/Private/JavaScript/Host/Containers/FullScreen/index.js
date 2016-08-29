import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {actions} from 'Host/Redux/index';

import style from './style.css';

@connect($transform({
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class FullScreen extends Component {
    static propTypes = {
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {isFullScreen, toggleFullScreen} = this.props;

        return isFullScreen ?
            <div className={style.fullScreenClose}>
                <IconButton icon="expand" onClick={toggleFullScreen}/>
            </div> :
            null;
    }
}
