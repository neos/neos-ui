import React from 'react';
import {Icon, IconButton} from '@neos-project/react-ui-components';
import style from './style.module.css';
import {Breadcrumb} from '../Breadcrumb';
import {IReference} from '../../domain';

interface ReferencesItemProps {
    reference: IReference;
    isDraggable?: boolean;
}

// todo remove?
export const ReferencesItem = (props: ReferencesItemProps) => {
    return (
        <div className={style.container}>
            {props.isDraggable ? (
                <div className={style.dragHandle}>
                    <IconButton icon={'grip-lines-vertical'} hoverStyle={'clean'} className={style.dragHandleIcon}/>
                </div>
            ) : null}
            <div className={style.main}>
                {props.reference.presentation ?
                    <>
                        <Icon className={style.icon} icon={props.reference.presentation.icon} size="lg" /><div className={style.labelContainer}>
                            <span className={style.label}>{props.reference.presentation.label}</span>
                            <Breadcrumb breadcrumbs={props.reference.presentation.breadcrumbs} />
                        </div>
                    </>
                    :
                    <div className={style.loader}>
                        <Icon icon="spinner" spin={true} />
                    </div>
            }
            </div>
        </div>
    );
};
