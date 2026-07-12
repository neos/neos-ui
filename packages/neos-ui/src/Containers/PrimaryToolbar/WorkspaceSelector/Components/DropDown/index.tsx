import style from './style.module.css';
import cx from 'classnames';
import {Button, Icon} from "@neos-project/react-ui-components";
import * as React from "react";

export type DropDownProps = React.PropsWithChildren<{
    id: string,
    enabled?: boolean
    buttonIcon: React.ReactNode,
    buttonTitle?: string,
    buttonLabel: string,
    buttonClassName?: string,
    dropDownClassName?: string,
}>;

export const DropDown = ({
    id,
    enabled,
    dropDownClassName,
    children,
    buttonIcon,
    buttonTitle,
    buttonLabel,
    buttonClassName
}: DropDownProps) => {
    return <>
        <div
            id={id}
            popover="auto"
            className={cx(style.dropDownContents, dropDownClassName)}
        >
            {children}
        </div>
        <Button
            title={buttonTitle}
            popovertarget={id}
            disabled={!enabled}
            style="lighter"
            hoverStyle="brand"
            className={cx(style.dropDownButton, buttonClassName)}
        >
            {buttonIcon}
            <span className={style.labelEllipsis}>{buttonLabel}</span>
            <Icon className={style.dropDownOpenerIcon} icon="chevron-down" padded="left"/>
        </Button>
    </>;
}
