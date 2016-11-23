import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {actions} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@connect($transform({
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class FullScreen extends PureComponent {
    static propTypes = {
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired
    };

    render() {
        const {isFullScreen, toggleFullScreen} = this.props;

        return isFullScreen ?
            <div className={style.fullScreenClose}>
                <IconButton icon="expand" onClick={toggleFullScreen}/>
            </div> :
            null;
    }
}
