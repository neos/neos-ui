import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get, $or} from 'plow-js';
import {memoize} from 'ramda';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import I18n from '@neos-project/neos-ui-i18n';
import Button from '@neos-project/react-ui-components/src/Button/index';

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
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        editPreviewMode: PropTypes.string.isRequired,
        isHidden: PropTypes.bool.isRequired,
        editPreviewModesRegistry: PropTypes.object.isRequired,
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

        const editModes = editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isEditingMode);
        const previewModes = editPreviewModesRegistry.getAllAsList().filter(editPreviewMode => editPreviewMode.isPreviewMode);

        return (
            <div className={classNames}>
                <div className={style.editModePanel__editingModes}>
                    <p>Editing Modes</p>
                    {editModes.map(editMode => (
                        <Button
                            key={editMode.id}
                            style={editMode.id === editPreviewMode ? 'brand' : null}
                            onClick={this.handleEditPreviewModeClick(editMode.id)}
                            className={style['editModePanel--button']}
                            >
                            <I18n id={editMode.title}/>
                        </Button>
                    ))}
                </div>
                <div className={style.editModePanel__previewCentral}>
                    <p>Preview Central</p>
                    {previewModes.map(previewMode => (
                        <Button
                            key={previewMode.id}
                            style={previewMode.id === editPreviewMode ? 'brand' : null}
                            onClick={this.handleEditPreviewModeClick(previewMode.id)}
                            className={style['editModePanel--button']}
                            >
                            <I18n id={previewMode.title}/>
                        </Button>
                    ))}
                </div>
            </div>
        );
    }
}
