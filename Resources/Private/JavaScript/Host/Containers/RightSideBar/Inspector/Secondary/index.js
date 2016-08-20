import React, {PropTypes} from 'react';
import style from './style.css';
import Portal from 'react-portal';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';

const Secondary = props => {
    const {onClose, children} = props;

    return (
        <Portal isOpened={true}>
            <div className={style.secondaryInspector}>
                <Button
                    style="cleanWithBorder"
                    className={style.close}
                    onClick={onClose}
                    >
                    <Icon icon="close"/>
                </Button>
                {children}
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
