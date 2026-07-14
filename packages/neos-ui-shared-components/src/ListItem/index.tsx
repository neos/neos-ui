import * as React from 'react';
import style from './style.module.css';

export type ListItemProps = React.PropsWithChildren<{}>;

export const ListItem = ({
    children
}: ListItemProps) => {
    return <li className={style.listItem}>
        {children}
    </li>;
}
