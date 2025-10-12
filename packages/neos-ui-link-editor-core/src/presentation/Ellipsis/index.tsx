import style from './style.module.css';
import React from 'react';

export const Ellipsis: React.FC = ({children}) => <span className={style.elipsis}>{children}</span>;
