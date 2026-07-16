import * as React from 'react';
import {Icon} from '@neos-project/react-ui-components';
import style from './style.module.css';

export type ListProps = React.PropsWithChildren<{
    icon?: string,
    label: string,
}>;

export const List = ({
    children,
    icon,
    label
}: ListProps) => {
    return <>
        <div className={style.listGroupHeader}>
            {icon ? <Icon padded="right" icon={icon}/> : ''}
            {label}
        </div>
        <ul className={style.listGroup}>{children}</ul>
    </>
}
