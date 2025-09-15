import * as React from 'react';
import styles from './Deletable.module.css';

import {IconButton} from '@neos-project/react-ui-components';

export const Deletable: React.FC<{
    id?: string
    onDelete(): void
}> = props => (
    <div className={styles.container} id={props.id}>
        <div>{props.children}</div>
        <IconButton className={styles.styledButton} icon="trash" hoverStyle="error" title="Delete Link" onClick={props.onDelete}/>
    </div>
)
