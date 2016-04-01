import React, {PropTypes} from 'react';
import style from './style.css';
import {
    Button,
    Icon,
    Portal
} from '../index';

const FullscreenContentOverlay = props => {
    return (
        <Portal targetId="neos__contentView__hook" isOpened={true} className={style.fullscreenContentOverlay}>
            <div>
                <Button style="cleanWithBorder" className={style.fullscreenContentOverlay__closeButton} onClick={props.onClose}><Icon icon="close" /></Button>
                {props.children}
            </div>
        </Portal>
    );
};
FullscreenContentOverlay.propTypes = {
    // Interaction related propTypes.
    onClose: PropTypes.func.isRequired
};

export default FullscreenContentOverlay;
