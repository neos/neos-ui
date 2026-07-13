import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import I18n, {translate} from '@neos-project/neos-ui-i18n';
import mergeClassNames from 'classnames';

import style from './style.module.css';
import {actions, selectors} from '@neos-project/neos-ui-redux-store/src';
import memoize from 'lodash.memoize';
import {Icon, DropDown, Button} from '@neos-project/react-ui-components';
import {getConfiguration} from '@neos-project/neos-ui-configuration';

@connect(state => ({
    editPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode(state)
}), {
    setEditPreviewMode: actions.UI.EditPreviewMode.set
})
export default class EditPreviewModeDropDown extends PureComponent {
    static propTypes = {
        editPreviewMode: PropTypes.string.isRequired,
        setEditPreviewMode: PropTypes.func.isRequired
    };

    handleEditPreviewModeClick = memoize(mode => () => {
        const {setEditPreviewMode} = this.props;
        setEditPreviewMode(mode);
    });

    componentDidMount() {
        const {editPreviewMode, setEditPreviewMode} = this.props;

        const editPreviewModes = getConfiguration(configuration => configuration.editPreviewModes);

        // Switch edit preview mode to the first one if the current one is not available
        if (!editPreviewModes[editPreviewMode]) {
            const fallbackEditPreviewMode = Object.values(editPreviewModes)[0];
            setEditPreviewMode(fallbackEditPreviewMode.id);
        }
    }

    render() {
        const {
            editPreviewMode
        } = this.props;

        const editPreviewModes = getConfiguration(configuration => configuration.editPreviewModes);

        const currentEditMode = editPreviewModes[editPreviewMode] || Object.values(editPreviewModes)[0];

        const editPreviewModesList = Object.keys(editPreviewModes).map(key => {
            const element = editPreviewModes[key];
            if (element) {
                element.id = key;
            }
            return element;
        });

        const editingModes = editPreviewModesList.filter(mode => mode !== null && mode.isEditingMode && mode.id !== mode);
        const previewModes = editPreviewModesList.filter(mode => mode !== null && mode.isPreviewMode && mode.id !== mode);

        const currentEditModeIsPreviewMode = currentEditMode.isPreviewMode && !currentEditMode.isEditingMode;

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={mergeClassNames({
                        [style.dropDown__btn]: true,
                        [style['dropDown__btn--isPreviewMode']]: currentEditModeIsPreviewMode
                    })}>
                        <span className={style.dropDown__modeBadge}>
                            <Icon className={style.dropDown__btnIcon} icon={currentEditModeIsPreviewMode ? 'eye' : 'pencil'}/>
                            {currentEditModeIsPreviewMode
                                ? translate('Neos.Neos.Ui:Main:editPreviewDropDown.previewMode', 'Preview Mode:')
                                : translate('Neos.Neos.Ui:Main:editPreviewDropDown.editMode', 'Edit Mode:')}
                        </span>
                        <span className={style.dropDown__currentEditMode}><I18n id={currentEditMode.title}/></span>
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        <div className={style.dropDown__groupHeader}>
                            <Icon className={style.dropDown__btnIcon} icon={'pencil'}/> {translate('Neos.Neos:Main:content.components.editPreviewPanel.modes', 'Editing Modes')}
                        </div>
                        <ul>
                            {editingModes.map(editingMode => (
                                <li className={style.dropDown__item} key={editingMode.id}>
                                    <Button
                                        disabled={editingMode.id === editPreviewMode}
                                        onClick={this.handleEditPreviewModeClick(editingMode.id)}
                                        style={editingMode.id === editPreviewMode ? 'brand' : null}
                                    >
                                        <I18n id={editingMode.title}/>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        {previewModes.length > 0 && (
                            <>
                                <div className={style.dropDown__groupHeader}>
                                    <Icon className={style.dropDown__btnIcon} icon={'eye'}/> {translate('Neos.Neos:Main:content.components.editPreviewPanel.previewCentral', 'Preview Central')}
                                </div>
                                <ul>
                                    {previewModes.map(previewMode => (
                                        <li className={style.dropDown__item} key={previewMode.id}>
                                            <Button
                                                disabled={previewMode.id === editPreviewMode}
                                                onClick={this.handleEditPreviewModeClick(previewMode.id)}
                                                style={previewMode.id === editPreviewMode ? 'brand' : null}
                                            >
                                                <I18n id={previewMode.title}/>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
