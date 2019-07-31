import React, {Fragment} from 'react';
import {$get} from 'plow-js';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import style from './LinkInput.css';

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
    linkRelNofollowValue
}) => {
    const anchorValue = typeof linkValue === 'string' ? linkValue.split('#')[1] : '';
    const baseValue = typeof linkValue === 'string' ? linkValue.split('#')[0] : '';
    return (
        <Fragment>
            {$get('anchor', linkingOptions) && (
                <div className={style.linkInput__optionsPanelItem}>
                    <label className={style.linkInput__optionsPanelLabel} htmlFor="__neos__linkEditor--anchor">
                        {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__anchor', 'Link to anchor')}
                    </label>
                    <div>
                        <TextInput
                            id="__neos__linkEditor--anchor"
                            value={anchorValue}
                            placeholder={i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__anchorPlaceholder', 'Enter anchor name')}
                            onChange={value => {
                                onLinkChange(value ? `${baseValue}#${value}` : baseValue);
                            }}
                        />
                    </div>
                </div>
            )}
            {$get('title', linkingOptions) && (
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
                {$get('targetBlank', linkingOptions) && (
                    <div className={style.linkInput__optionsPanelItem}>
                        <label>
                            <CheckBox
                                onChange={onLinkTargetChange}
                                isChecked={linkTargetBlankValue || false}
                            /> {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__targetBlank', 'Open in new window')}
                        </label>
                    </div>)}
                {$get('relNofollow', linkingOptions) && (
                    <div className={style.linkInput__optionsPanelItem}>
                        <label>
                            <CheckBox
                                onChange={onLinkRelChange}
                                isChecked={linkRelNofollowValue || false}
                            /> {i18nRegistry.translate('Neos.Neos.Ui:Main:ckeditor__toolbar__link__noFollow', 'No follow')}
                        </label>
                    </div>)}
            </div>
        </Fragment>
    );
};

export default LinkInputOptions;
