import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get, $or} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import Button from '@neos-project/react-ui-components/lib/Button/index';

import style from './style.css';

@connect($transform({
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    editPreviewMode: $get('ui.editPreviewMode'),
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
export default class EditModePanel extends Component {
    static propTypes = {
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        editPreviewMode: PropTypes.string.isRequired,
        isHidden: PropTypes.bool.isRequired,
        editPreviewModesRegistry: PropTypes.object.isRequired,
        setEditPreviewMode: PropTypes.function.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    handleEditPreviewModeClick(mode) {
        return () => this.props.setEditPreviewMode(mode);
    }

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

        const editModes = editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isEditingMode);
        const previewModes = editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isPreviewMode);

        return (
            <div className={classNames}>
                <div className={style.editModePanel__editingModes}>
                    <p>Editing Modes</p>
                    {editModes.map(editMode => <Button key={editMode.id} style={editMode.id === editPreviewMode ? 'brand' : ''} onClick={this.handleEditPreviewModeClick(editMode.id)}>{editMode.id}</Button>)}
                </div>
                <div className={style.editModePanel__previewCentral}>
                    <p>Preview Central</p>
                    {previewModes.map(previewMode => <Button key={previewMode.id} style={previewMode.id === editPreviewMode ? 'brand' : ''} onClick={this.handleEditPreviewModeClick(previewMode.id)}>{previewMode.id}</Button>)}
                </div>
            </div>
        );
    }
}
