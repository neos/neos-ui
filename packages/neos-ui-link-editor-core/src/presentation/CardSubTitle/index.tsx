import * as React from 'react';
import style from './style.module.css';

import {Ellipsis} from '../Ellipsis';

export const CardSubTitle: React.FC<{
}> = props => (
    <span className={style.container}>
        <Ellipsis>{props.children}</Ellipsis>
    </span>
);
