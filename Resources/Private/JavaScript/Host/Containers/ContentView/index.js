import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import style from './style.css';

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    src: $get('ui.contentView.src'),
    contextPath: $get('ui.contentView.contextPath')
}))
export default class ContentView extends Component {
    static propTypes = {
        isFringeLeft: PropTypes.bool.isRequired,
        isFringeRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired,
        contextPath: PropTypes.string.isRequired
    };

    render() {
        const {isFringeLeft, isFringeRight, isFullScreen, src, contextPath} = this.props;

        const classNames = mergeClassNames({
            [style.contentView]: true,
            [style['contentView--isFringeLeft']]: isFringeLeft,
            [style['contentView--isFringeRight']]: isFringeRight,
            [style['contentView--isFullScreen']]: isFullScreen
        });

        return (
            <div className={classNames} id="neos__contentView">
                <iframe
                    src={src}
                    frameBorder="0"
                    name={'neos-content-main'}
                    data-context-path={contextPath}
                    className={style.contentView__item}
                    />
            </div>
        );
    }
}
