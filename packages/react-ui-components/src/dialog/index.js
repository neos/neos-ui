import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';
import executeCallback from './../_lib/executeCallback.js';
import IconButton from 'Components/IconButton/index';
import Portal from 'Components/Portal/index';
// import style from './style.css';

const Dialog = props => {
    const {
        className,
        title,
        wide,
        children,
        isOpen,
        onRequestClose,
        actions,
        style,
        ...restProps
    } = props;
    const rest = omit(restProps, ['isOpen']);
    const dialogStyle = wide ? style['dialog--wide'] : style.dialog;
    const classNames = mergeClassNames({
        [dialogStyle]: true,
        [className]: className && className.length
    });

    return (
        <Portal targetId="dialog" isOpen={isOpen}>
            <section {...rest} className={classNames} role="dialog" tabIndex="0">
                <div className={style.dialog__contentsPosition}>
                    <div className={style.dialog__contents}>
                        <IconButton
                            icon="close"
                            className={style.dialog__closeBtn}
                            id="neos__modal__closeModal"
                            onClick={e => executeCallback({e, cb: onRequestClose})}
                            />
                        <div className={style.dialog__title}>
                            {title}
                        </div>

                        {children}

                        <div className={style.dialog__actions}>
                            {actions.map((action, index) => <span key={index}>{action}</span>)}
                        </div>
                    </div>
                </div>
            </section>
        </Portal>
    );
};
Dialog.propTypes = {
    // State propTypes.
    isOpen: PropTypes.bool.isRequired,

    // Will be called once the close icon in the top right corner gets clicked.
    onRequestClose: PropTypes.func.isRequired,

    // Dialog's title
    title: PropTypes.any,

    // Wider verision of the Dialog
    wide: PropTypes.bool,

    // Contents of the Dialog.
    children: PropTypes.node.isRequired,

    // Optional Array of nodes(Action buttons f.e.) which are placed at the bottom of the Dialog.
    actions: PropTypes.node.isRequired,

    // Style related propTypes.
    className: PropTypes.string,
    style: PropTypes.object
};
Dialog.defaultProps = {
    style: {}
};

export default Dialog;
