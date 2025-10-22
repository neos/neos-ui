import React, {PropsWithChildren} from 'react';
import {IconButton} from '@neos-project/react-ui-components';
import style from './style.module.css';

interface HoverActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    // optionally control visibility externally in future; for now purely hover-based
}

export const HoverActions: React.FC<PropsWithChildren<HoverActionsProps>> = ({children, onEdit, onDelete}) => {
    return (
        <div className={style.wrapper}>
            {children}
            <div className={style.actions}>
                <IconButton
                    icon="pencil"
                    hoverStyle="brand"
                    title="Edit"
                    onClick={onEdit}
                    size="regular"
                />
                <IconButton
                    icon="trash"
                    hoverStyle="warn"
                    title="Delete"
                    onClick={onDelete}
                    size="regular"
                />
            </div>
        </div>
    );
};
