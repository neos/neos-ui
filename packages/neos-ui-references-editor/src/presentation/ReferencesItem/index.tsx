import React from 'react';
import {Icon, IconButton} from '@neos-project/react-ui-components';
import style from './style.module.css';
import {Breadcrumb} from '../Breadcrumb';

interface ReferencesItemProps {
    reference: {
        breadcrumbs: {
            icon: string;
            label: string;
        }[]
        icon: string;
        label: string;
        uri: string;
        hasProperties: boolean;
    };
    isDraggable?: boolean;
}

export const ReferencesItem = (props: ReferencesItemProps) => {
    return (
        <div className={style.container}>
            {props.isDraggable ? (
                <div className={style.dragHandle}>
                    <IconButton icon={'grip-lines-vertical'} hoverStyle={'clean'} className={style.dragHandleIcon}/>
                </div>
            ) : null}
            <div className={style.main}>
                <Icon className={style.icon} icon={props.reference.icon} size="lg" />
                <div className={style.labelContainer}>
                    <span className={style.label}>{props.reference.label}</span>
                    <Breadcrumb breadcrumbs={props.reference.breadcrumbs}/>
                </div>
            </div>
        </div>
    );
};
