import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import style from './style.css';

@connect($transform({
    isFringeLeft: $get('ui.leftSideBar.isHidden'),
    isFringeRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    src: $get('ui.contentCanvas.src'),
    contextPath: $get('ui.contentCanvas.contextPath')
}))
export default class ContentCanvas extends Component {
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
            [style.contentCanvas]: true,
            [style['contentCanvas--isFringeLeft']]: isFringeLeft,
            [style['contentCanvas--isFringeRight']]: isFringeRight,
            [style['contentCanvas--isFullScreen']]: isFullScreen
        });

        return (
            <div className={classNames} id="neos__contentCanvas">
                <div id="centerArea" />
                <div className={style.contentView__itemWrapper}>
                    <iframe
                        src={src}
                        frameBorder="0"
                        name={'neos-content-main'}
                        data-context-path={contextPath}
                        className={style.contentCanvas__contents}
                        />
                    <div className={style.contentView__item} id="neos__contentView__hook">
                    </div>
                </div>
            </div>
        );
    }
}
