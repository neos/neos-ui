import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';

import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';
import {actions, selectors} from '@neos-project/neos-ui-redux-store/src';
import memoize from 'lodash.memoize';
import Button from '@neos-project/react-ui-components/src/Button';

@connect($transform({
    editPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode
}), {
    setEditPreviewMode: actions.UI.EditPreviewMode.set
})
@neos(globalRegistry => ({
    editPreviewModes: globalRegistry.get('frontendConfiguration').get('editPreviewModes'),
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class EditPreviewModeDropDown extends PureComponent {
    static propTypes = {
        editPreviewMode: PropTypes.string.isRequired,
        setEditPreviewMode: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        editPreviewModes: PropTypes.object.isRequired
    };

    handleEditPreviewModeClick = memoize(mode => () => {
        const {setEditPreviewMode} = this.props;
        setEditPreviewMode(mode);
    });

    render() {
        const {
            editPreviewMode,
            editPreviewModes,
            i18nRegistry
        } = this.props;

        const currentEditMode = editPreviewModes[editPreviewMode];

        const editPreviewModesList = Object.keys(editPreviewModes).map(key => {
            const element = editPreviewModes[key];
            if (element) {
                element.id = key;
            }
            return element;
        });

        const editingModes = editPreviewModesList.filter(mode => mode !== null && mode.isEditingMode && mode.id !== mode);
        const previewModes = editPreviewModesList.filter(mode => mode !== null && mode.isPreviewMode && mode.id !== mode);

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn}>
                        <Icon className={style.dropDown__btnIcon} icon={currentEditMode.isEditingMode ? 'pencil' : 'eye'}/>
                        <span className={style.dropDown__currentEditMode}><I18n id={currentEditMode.title}/></span>
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        <div className={style.dropDown__groupHeader}>
                            <Icon className={style.dropDown__btnIcon} icon={'pencil'}/> {i18nRegistry.translate('content.components.editPreviewPanel.modes', 'Editing Modes')}
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
                        <div className={style.dropDown__groupHeader}>
                            <Icon className={style.dropDown__btnIcon} icon={'eye'}/> {i18nRegistry.translate('content.components.editPreviewPanel.previewCentral', 'Preview Central')}
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
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
