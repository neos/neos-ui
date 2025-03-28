import React from 'react';
import mergeClassNames from 'classnames';
import style from './style.module.css';

type ResourceIconProps = {
    source?: string;
    className?: string;
    label?: string;
}

export function ResourceIcon(props: ResourceIconProps) {
    const {source, className, label} = props;

    if (!source) {
        return null;
    }

    const classNames = mergeClassNames(
        className,
        {
            [style['resource-icon']]: true
        }
    );

    return <span dangerouslySetInnerHTML={{__html: source}} aria-label={label} className={classNames}></span>;
}
