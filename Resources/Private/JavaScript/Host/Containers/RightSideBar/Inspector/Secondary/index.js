import React, {PropTypes} from 'react';
import style from './style.css';
import {
    Button,
    Icon,
    Portal
} from 'Components/index';

const Secondary = props => {
    return (
        <Portal
            target="contentCanvas"
            isOpened={true}
            >
            <div className={style.secondaryInspector}>
                <Button
                    style="cleanWithBorder"
                    className={style.close}
                    onClick={() => props.onClose()}
                    >
                    <Icon icon="close" />
                </Button>
                {props.children}
            </div>
        </Portal>
    );
};
Secondary.propTypes = {
    // Interaction related propTypes.
    onClose: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
};

export default Secondary;
