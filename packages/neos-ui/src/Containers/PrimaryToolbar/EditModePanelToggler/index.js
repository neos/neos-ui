import React, {PureComponent, PropTypes} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button/';
import I18n from '@neos-project/neos-ui-i18n';
import mergeClassNames from 'classnames';
import style from './style.css';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {actions} from '@neos-project/neos-ui-redux-store';

@connect($transform({
    isEditModePanelHidden: $get('ui.editModePanel.isHidden')
}), {
    toggleEditModePanel: actions.UI.EditModePanel.toggle
})
export default class EditModePanelToggler extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        toggleEditModePanel: PropTypes.func.isRequired
    };

    handleToggle = () => {
        const {toggleEditModePanel} = this.props;

        toggleEditModePanel();
    }

    render() {
        const {className, isEditModePanelHidden} = this.props;
        const isActive = !isEditModePanelHidden;
        const classNames = mergeClassNames({
            [className]: true,
            [style['btn--isActive']]: isActive
        });

        return (
            <Button
                className={classNames}
                style="clean"
                hoverStyle="clean"
                isFocused={isActive}
                onClick={this.handleToggle}
                >
                <I18n id="editPreview" fallback="Edit / Preview"/>
            </Button>
        );
    }
}
