import React from "react";
import styles from './style.module.css'

export const SeamlessButton: React.FC<{
    title: string
    onClick: () => void
}> = props => {
    return <button title={props.title} onClick={props.onClick} type='button' className={styles.button}>{props.children}</button>
}
