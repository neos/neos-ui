import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class FullScreenButton extends PureComponent {
    static propTypes = {
        toggleFullScreen: PropTypes.func
    };

    render() {
        const {toggleFullScreen} = this.props;

        return (
            <IconButton icon="expand" onClick={toggleFullScreen}/>
        );
    }
}
