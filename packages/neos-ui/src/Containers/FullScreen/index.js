import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

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

    handleToggle = () => {
        const {toggleFullScreen} = this.props;

        toggleFullScreen();
    }

    render() {
        const {isFullScreen} = this.props;

        if (!isFullScreen) {
            return null;
        }

        return (
            <div className={style.fullScreenClose}>
                <IconButton icon="expand" onClick={this.handleToggle}/>
            </div>
        );
    }
}
