import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get, $or} from 'plow-js';
import {memoize} from 'ramda';
import HorizontalScroll from 'react-scroll-horizontal';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import I18n from '@neos-project/neos-ui-i18n';

import Panel from './Panel';
import style from './style.css';

@connect($transform({
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    editPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode,
    isHidden: $or(
        $get('ui.editModePanel.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    )
}), {
    setEditPreviewMode: actions.UI.EditPreviewMode.set
})
@neos(globalRegistry => ({
    editPreviewModesRegistry: globalRegistry.get('editPreviewModes')
}))
export default class EditModePanel extends PureComponent {
    static propTypes = {
        editPreviewModesRegistry: PropTypes.object.isRequired,

        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        editPreviewMode: PropTypes.string.isRequired,
        isHidden: PropTypes.bool.isRequired,
        setEditPreviewMode: PropTypes.func.isRequired
    };

    handleEditPreviewModeClick = memoize(mode => () => {
        const {setEditPreviewMode} = this.props;

        setEditPreviewMode(mode);
    });

    render() {
        const {
            isFringedLeft,
            isFringedRight,
            editPreviewMode,
            isHidden,
            editPreviewModesRegistry
        } = this.props;
        const classNames = mergeClassNames({
            [style.editModePanel]: true,
            [style['editModePanel--isFringeLeft']]: isFringedLeft,
            [style['editModePanel--isFringeRight']]: isFringedRight,
            [style['editModePanel--isHidden']]: isHidden
        });

        const currentEditMode = editPreviewModesRegistry.get(editPreviewMode);

        return (
            <div className={classNames}>
                <div className={style.editModePanel__wrapper}>
                    <Panel
                        title="Editing Mode"
                        className={style.editModePanel__editingModes}
                        modes={editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isEditingMode && editPreviewMode.id !== editPreviewMode)}
                        current={editPreviewMode}
                        currentMode={currentEditMode.isEditingMode ? currentEditMode : null}
                        style={style}
                        handleEditPreviewModeClick={this.handleEditPreviewModeClick}
                    />
                    <Panel
                        title="Preview Central"
                        className={style.editModePanel__previewModes}
                        modes={editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isPreviewMode && editPreviewMode.id !== editPreviewMode)}
                        current={editPreviewMode}
                        currentMode={currentEditMode.isPreviewMode ? currentEditMode : null}
                        style={style}
                        handleEditPreviewModeClick={this.handleEditPreviewModeClick}
                    />
                </div>
            </div>
        );
    }
}
