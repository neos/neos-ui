import * as React from 'react';
import style from './style.module.css';

import {Ellipsis} from '../Ellipsis';

export const CardTitle: React.FC<{
    span: 1 | 2
}> = props => (
    <span className={style.container} style={{gridRowEnd: `span ${props.span}`}}>
        <Ellipsis>{props.children}</Ellipsis>
    </span>
);
