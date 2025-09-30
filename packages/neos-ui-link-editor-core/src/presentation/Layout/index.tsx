import style from './style.module.css';
import React from "react";

export const Container: React.FC = ({children}) => <div className={style.elipsis}>{children}</div>;

export const Stack: React.FC = ({children}) => <div className={style.stack}>{children}</div>;

export const Columns: React.FC = ({children}) => <div className={style.columns}>{children}</div>;
