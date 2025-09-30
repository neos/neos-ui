import * as React from 'react';
import style from './style.module.css';

export const Form: React.FC = props => (
    <div className={style.form}>
        {props.children}
    </div>
);
