import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    hasFocusedContentNode: selectors.CR.Nodes.hasFocusedContentNode
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class SecondaryToolbar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,

        previewUrl: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired,
        hasFocusedContentNode: PropTypes.bool.isRequired
    };

    handleToggleFullScreen = () => {
        const {toggleFullScreen} = this.props;

        toggleFullScreen();
    }

    render() {
        const {
            containerRegistry,
            previewUrl,
            isFringedLeft,
            isFringedRight,
            isEditModePanelHidden,
            isFullScreen,
            hasFocusedContentNode
        } = this.props;
        const classNames = mergeClassNames({
            [style.secondaryToolbar]: true,
            [style['secondaryToolbar--isFringeLeft']]: isFringedLeft,
            [style['secondaryToolbar--isFringeRight']]: isFringedRight,
            [style['secondaryToolbar--isMovedDown']]: !isEditModePanelHidden,
            [style['secondaryToolbar--isHidden']]: isFullScreen
        });
        const previewButtonClassNames = mergeClassNames({
            [style.secondaryToolbar__buttonLink]: true,
            [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        });

        const DimensionSwitcher = containerRegistry.get('SecondaryToolbar/DimensionSwitcher');
        const EditorToolbar = containerRegistry.get('SecondaryToolbar/EditorToolbar');
        const LoadingIndicator = containerRegistry.get('SecondaryToolbar/LoadingIndicator');

        return (
            <div className={classNames}>
                {hasFocusedContentNode ? <EditorToolbar/> : <DimensionSwitcher/>}

                <div className={style.secondaryToolbar__rightHandedActions}>
                    <a
                        href={previewUrl ? previewUrl : ''}
                        target="neosPreview"
                        rel="noopener noreferrer"
                        className={previewButtonClassNames}
                        >
                        <Icon icon="external-link"/>
                    </a>
                    <IconButton icon="expand" onClick={this.handleToggleFullScreen}/>
                </div>
                <LoadingIndicator/>
            </div>
        );
    }
}
