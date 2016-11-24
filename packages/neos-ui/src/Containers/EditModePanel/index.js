import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get, $or} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Button from '@neos-project/react-ui-components/lib/Button/index';
import buttonStyles from '@neos-project/react-ui-components/lib/Button/style.css';


const {isDocumentNodeSelectedSelector} = selectors.CR.Nodes;

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
    //toggleFullScreen: actions.UI.FullScreen.toggle
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
        editPreviewModesRegistry: PropTypes.object.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
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
        // const previewButtonClassNames = mergeClassNames({
        //     [style.secondaryToolbar__buttonLink]: true,
        //     [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        // });

        const editModes = editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isEditingMode);
        const previewModes = editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isPreviewMode);

        return (
            <div className={classNames}>
                <div className={style.editModePanel__editingModes}>
                    <p>Editing Modes</p>
                    {editModes.map((editMode) => <Button style="lighter" className={editMode.id === editPreviewMode ? buttonStyles['btn--brand'] : ''} /*onClick={this.handleDiscard}*/>{editMode.id}</Button>)}
                </div>
                <div className={style.editModePanel__previewCentral}>
                    <p>Preview Central</p>
                    {previewModes.map((previewMode) => <Button style="lighter" className={previewMode.id === editPreviewMode ? buttonStyles['btn--brand'] : ''} /*onClick={this.handleDiscard}*/>{previewMode.id}</Button>)}
                </div>

            </div>
        );
    }
}
