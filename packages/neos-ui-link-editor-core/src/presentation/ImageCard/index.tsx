import * as React from 'react';
import style from './style.module.css';

import {CardTitle} from '../CardTitle';

interface Props {
    label: string
    src: string
}

export const ImageCard: React.FC<Props> = props => {
    return (
        <div className={style.container}>
            <img className={style.image} src={props.src}/>
            <CardTitle span={1}>
                {props.label}
            </CardTitle>
        </div>
    );
}
