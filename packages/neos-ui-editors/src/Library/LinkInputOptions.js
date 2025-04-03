import React, {Fragment} from 'react';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import style from './LinkInput.module.css';

const LinkInputOptions = ({
    i18nRegistry,
    onLinkChange,
    linkingOptions,
    linkValue,
    linkTitleValue,
    onLinkTitleChange,
    onLinkTargetChange,
    linkTargetBlankValue,
    onLinkRelChange,
    linkRelNofollowValue,
    onLinkDownloadChange,
    linkDownloadValue
}) => {
    const anchorValue = typeof linkValue === 'string' ? linkValue.split('#')[1] : '';
    const baseValue = typeof linkValue === 'string' ? linkValue.split('#')[0] : '';
    return (
        <Fragment>
            {linkingOptions?.anchor && (
                <div className={style.linkInput__optionsPanelItem}>
                    <label className={style.linkInput__optionsPanelLabel} htmlFor="__neos__linkEditor--anchor">
                        {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__anchor', 'Link to anchor')}
                    </label>
                    <div>
                        <TextInput
                            id="__neos__linkEditor--anchor"
                            value={anchorValue ?? ''}
                            placeholder={i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__anchorPlaceholder', 'Enter anchor name')}
                            onChange={value => {
                                onLinkChange(value ? `${baseValue}#${value}` : baseValue);
                            }}
                        />
                    </div>
                </div>
            )}
            {linkingOptions?.title && (
                <div className={style.linkInput__optionsPanelItem}>
                    <label className={style.linkInput__optionsPanelLabel} htmlFor="__neos__linkEditor--title">
                        {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__title', 'Title')}
                    </label>
                    <div>
                        <TextInput
                            id="__neos__linkEditor--title"
                            value={linkTitleValue || ''}
                            placeholder={i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__titlePlaceholder', 'Enter link title')}
                            onChange={value => {
                                onLinkTitleChange(value);
                            }}
                        />
                    </div>
                </div>
            )}

            <div className={style.linkInput__optionsPanelDouble}>
                {linkingOptions?.targetBlank && (
                    <div className={style.linkInput__optionsPanelItem}>
                        <label className={style.linkInput__optionsPanelCheckbox}>
                            <CheckBox
                                onChange={onLinkTargetChange}
                                isChecked={linkTargetBlankValue || false}
                            /> {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__targetBlank', 'Open in new window')}
                        </label>
                    </div>)}
                {linkingOptions?.relNofollow && (
                    <div className={style.linkInput__optionsPanelItem}>
                        <label className={style.linkInput__optionsPanelCheckbox}>
                            <CheckBox
                                onChange={onLinkRelChange}
                                isChecked={linkRelNofollowValue || false}
                            /> {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__noFollow', 'No follow')}
                        </label>
                    </div>)}
            </div>
            {linkingOptions?.download && (
                <div className={style.linkInput__optionsPanelItem}>
                    <label className={style.linkInput__optionsPanelCheckbox}>
                        <CheckBox
                            onChange={onLinkDownloadChange}
                            isChecked={linkDownloadValue || false}
                        /> {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__download', 'is download')}
                    </label>
                </div>)}
        </Fragment>
    );
};

export default LinkInputOptions;
