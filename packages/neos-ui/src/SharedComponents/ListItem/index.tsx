import * as React from 'react';
import style from './style.module.css';

export type ListItemProps = React.PropsWithChildren<{
    key?: React.Key,
}>;

export const ListItem = ({
    key,
    children
}: ListItemProps) => {
    return <li className={style.listItem} key={key}>
        {children}
    </li>;
}
