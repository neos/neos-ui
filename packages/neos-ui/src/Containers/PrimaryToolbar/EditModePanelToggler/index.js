import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Button from '@neos-project/react-ui-components/src/Button/';
import I18n from '@neos-project/neos-ui-i18n';
import mergeClassNames from 'classnames';
import style from './style.css';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

@connect($transform({
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    editPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode
}), {
    toggleEditModePanel: actions.UI.EditModePanel.toggle
})
@neos(globalRegistry => ({
    editPreviewModesRegistry: globalRegistry.get('editPreviewModes')
}))
export default class EditModePanelToggler extends PureComponent {
    static propTypes = {
        className: PropTypes.string.isRequired,

        isEditModePanelHidden: PropTypes.bool.isRequired,
        editPreviewMode: PropTypes.string.isRequired,

        toggleEditModePanel: PropTypes.func.isRequired,

        editPreviewModesRegistry: PropTypes.object.isRequired
    };

    handleToggle = () => {
        const {toggleEditModePanel} = this.props;

        toggleEditModePanel();
    };

    render() {
        const {className, isEditModePanelHidden, editPreviewMode, editPreviewModesRegistry} = this.props;
        const isActive = !isEditModePanelHidden;
        const classNames = mergeClassNames({
            [className]: true,
            [style['btn--isActive']]: isActive
        });

        const currentEditMode = editPreviewModesRegistry.get(editPreviewMode);

        let editLabel = <I18n id="edit" fallback="Edit"/>;
        let previewLabel = <I18n id="preview" fallback="Preview"/>;

        const toBold = string => <b>{string}</b>;

        if (currentEditMode.isEditingMode) {
            editLabel = toBold(editLabel);
        } else {
            previewLabel = toBold(previewLabel);
        }

        return (
            <Button
                className={classNames}
                style="clean"
                hoverStyle="clean"
                isFocused={isActive}
                onClick={this.handleToggle}
                >
                {editLabel} / {previewLabel}
            </Button>
        );
    }
}
