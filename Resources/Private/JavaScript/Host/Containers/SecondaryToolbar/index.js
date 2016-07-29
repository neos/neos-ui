import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {actions} from 'Host/Redux/index';
import {IconButton, Icon} from 'Components/index';
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

    render() {
        const {previewUrl, isFringedLeft, isFringedRight, isFullScreen} = this.props;
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
                {this.props.isDocumentNodeSelected ? <DimensionSwitcher /> : <EditorToolbar />}

                <div className={style.secondaryToolbar__rightHandedActions}>
                    <a
                        href={previewUrl ? previewUrl : ''}
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
