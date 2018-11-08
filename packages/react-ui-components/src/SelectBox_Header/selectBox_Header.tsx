// tslint:disable:class-name
import React, {PureComponent} from 'react';

import Icon from '../Icon';
import IconButton from '../IconButton';
import ListPreviewElement from '../ListPreviewElement';
import {SelectOption} from '../SelectBox_ListPreview/selectBox_ListPreview';

interface SelectBox_Header_Props {
    // API with SelectBox
    readonly option?: SelectOption;
    readonly placeholder: string;
    readonly placeholderIcon?: string;
    readonly showResetButton: boolean;
    readonly onReset?: () => void;
    readonly displayLoadingIndicator: boolean;
    readonly disabled?: boolean;

    /* ------------------------------
     * Theme & Dependencies
     * ------------------------------ */
    readonly theme?: SelectBox_Header_Theme;
}

interface SelectBox_Header_Theme {
    readonly selectBoxHeader: string;
    readonly selectBoxHeader__icon: string;
    readonly selectBoxHeader__innerPreview: string;
    readonly selectBoxHeader__label: string;
    readonly selectBoxHeader__seperator: string;
    readonly selectBoxHeader__wrapperIconWrapper: string;
}

/**
 * **SelectBox_Header is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component which displays the currently selected value.
 */
export default class SelectBox_Header extends PureComponent<SelectBox_Header_Props> {
    public render(): JSX.Element {
        const {
            option,
            theme,
            placeholder,
            placeholderIcon,
            displayLoadingIndicator,
            disabled,
            showResetButton,
        } = this.props;

        const label = (option && option.label) ? option.label : placeholder;
        const icon = (option && option.icon) ? option.icon : placeholderIcon;
        const isDisabled = Boolean(option && option.disabled || disabled);

        return (
            <div className={theme!.selectBoxHeader}>
                {displayLoadingIndicator ?
                    (
                        <span className={theme!.selectBoxHeader__wrapperIconWrapper}>
                            <Icon className={theme!.selectBoxHeader__icon} spin={true} icon="spinner"/>
                        </span>
                    ) :
                    (
                        <div className={theme!.selectBoxHeader__innerPreview}>
                            {option ?
                                <ListPreviewElement
                                    isHighlighted={false}
                                    icon={icon}
                                    disabled={isDisabled}
                                >{label}</ListPreviewElement> :
                                <div className={theme!.selectBoxHeader__label}>{label}</div>}
                        </div>
                    )
                }
                {showResetButton && this.renderResetButton()}
            </div>
        );
    }

    private readonly renderResetButton = (): JSX.Element => {
        const {theme, disabled, onReset} = this.props;

        return (
            <span>
                // TODO: themr looses default props type information of components
                // @ts-ignore
                <IconButton className={theme!.selectBoxHeader__icon} disabled={disabled} icon="times" onClick={disabled ? undefined : onReset}/>
                <span className={theme!.selectBoxHeader__seperator}/>
            </span>
        );
    }
}
