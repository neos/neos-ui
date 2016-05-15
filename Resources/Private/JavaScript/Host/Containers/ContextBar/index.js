import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import {IconButton, Icon} from 'Components/index';
import DimensionSwitcher from './DimensionSwitcher/index';

import style from './style.css';

@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen')
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class ContextBar extends Component {
    static propTypes = {
        previewUrl: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired
    };

    render() {
        const {previewUrl, isFringedLeft, isFringedRight, isFullScreen} = this.props;
        const classNames = mergeClassNames({
            [style.contextBar]: true,
            [style['contextBar--isFringeLeft']]: isFringedLeft,
            [style['contextBar--isFringeRight']]: isFringedRight,
            [style['contextBar--isHidden']]: isFullScreen
        });
        const previewButtonClassNames = mergeClassNames({
            [style.contextBar__buttonLink]: true,
            [style['contextBar__buttonLink--isDisabled']]: !previewUrl
        });

        return (
            <div className={classNames}>
                <DimensionSwitcher />

                <div className={style.contextBar__rightHandedActions}>
                    <a
                        href={previewUrl ? previewUrl : '#'}
                        target="_blank"
                        className={previewButtonClassNames}
                        rel="noopener"
                        >
                        <Icon icon="external-link" />
                    </a>
                    <IconButton icon="expand" onClick={() => this.props.toggleFullScreen()} />
                </div>
            </div>
        );
    }
}
