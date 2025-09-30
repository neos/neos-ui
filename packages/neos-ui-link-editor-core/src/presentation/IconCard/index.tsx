import * as React from 'react';
import style from './style.module.css';

import {Icon} from '@neos-project/react-ui-components';
import {CardTitle} from '../CardTitle';
import {CardSubTitle} from '../CardSubTitle';

interface Props {
    icon: string;
    title: string;
    subTitle?: string;
}

export const IconCard: React.FC<Props> = props => {
    const iconWrapperSpan = props.subTitle ? 1 : 2;

    return (
        <div className={style.container}>
            <span className={style.iconWrapper} style={{gridRowEnd: `span ${iconWrapperSpan}`}}>
                <Icon icon={props.icon}/>
            </span>
            <CardTitle span={props.subTitle ? 1 : 2}>
                {props.title}
            </CardTitle>
            <CardSubTitle>
                {props.subTitle}
            </CardSubTitle>
        </div>
    );
}
