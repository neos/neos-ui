import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import {actions} from 'Host/Redux/index';

import DimensionSwitcher from './DimensionSwitcher/index';
import EditorToolbar from './EditorToolbar/index';
import {isDocumentNodeSelectedSelector} from 'Host/Selectors/CR/Nodes/index';

import style from './style.css';

@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    isDocumentNodeSelected: isDocumentNodeSelectedSelector
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class SecondaryToolbar extends Component {
    static propTypes = {
        previewUrl: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired,
        isDocumentNodeSelected: PropTypes.bool.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {
            previewUrl,
            isFringedLeft,
            isFringedRight,
            isFullScreen,
            toggleFullScreen
        } = this.props;
        const classNames = mergeClassNames({
            [style.secondaryToolbar]: true,
            [style['secondaryToolbar--isFringeLeft']]: isFringedLeft,
            [style['secondaryToolbar--isFringeRight']]: isFringedRight,
            [style['secondaryToolbar--isHidden']]: isFullScreen
        });
        const previewButtonClassNames = mergeClassNames({
            [style.secondaryToolbar__buttonLink]: true,
            [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        });

        return (
            <div className={classNames}>
                {this.props.isDocumentNodeSelected ? <DimensionSwitcher/> : <EditorToolbar/>}

                <div className={style.secondaryToolbar__rightHandedActions}>
                    <a
                        href={previewUrl ? previewUrl : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={previewButtonClassNames}
                        >
                        <Icon icon="external-link"/>
                    </a>
                    <IconButton icon="expand" onClick={toggleFullScreen}/>
                </div>
            </div>
        );
    }
}
