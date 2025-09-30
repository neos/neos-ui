import * as React from 'react';
import style from './style.module.css';

import {IconButton} from '@neos-project/react-ui-components';

export const Deletable: React.FC<{
    id?: string
    onDelete(): void
}> = props => (
    <div className={style.container} id={props.id}>
        <div>{props.children}</div>
        <IconButton className={style.styledButton} icon="trash" hoverStyle="error" title="Delete Link" onClick={props.onDelete}/>
    </div>
)
