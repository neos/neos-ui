import React from 'react';
import {Icon} from '@neos-project/react-ui-components';
import style from './style.module.css';

interface BreadcrumbProps {
    breadcrumbs: {
        icon: string;
        label: string;
    }[]
}

export const Breadcrumb = (props: BreadcrumbProps) => {
    const items = props.breadcrumbs || [];

    return (
        <span className={style.container}>
            {items.map((breadcrumb, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span className={style.item} key={`${breadcrumb.label}-${index}`}>
                        <Icon className={style.breadcrumbIcon} icon={breadcrumb.icon} size="sm"/>
                        <span className={style.label}>{breadcrumb.label}</span>
                        {!isLast && (
                            <Icon className={style.separator} icon="angle-right" size="sm"/>
                        )}
                    </span>
                );
            })}
        </span>
    );
}
