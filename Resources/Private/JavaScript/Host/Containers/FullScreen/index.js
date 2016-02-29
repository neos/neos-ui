import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {actions} from 'Host/Redux/';
import {IconButton} from 'Host/Components/';
import style from './style.css';
import {immutableOperations} from 'Shared/Utilities/';

const {$get} = immutableOperations;

@connect(state => ({
    isFullScreen: $get(state, 'ui.fullScreen.isFullScreen')
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class FullScreen extends Component {
    static propTypes = {
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired
    };

    render() {
        return this.props.isFullScreen ?
            (
                <div className={style.fullScreenClose}>
                    <IconButton icon="expand" onClick={() => this.props.toggleFullScreen()} />
                </div>
            ) :
            null;
    }
}
