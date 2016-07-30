import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';
import executeCallback from './../_lib/executeCallback.js';
import IconButton from './../iconButton/index';
import Portal from './../portal/index';

const Dialog = props => {
    const {
        className,
        title,
        wide,
        children,
        isOpen,
        onRequestClose,
        actions,
        theme,
        ...restProps
    } = props;
    const rest = omit(restProps, ['isOpen']);
    const dialogStyle = wide ? theme['dialog--wide'] : theme.dialog;
    const classNames = mergeClassNames({
        [dialogStyle]: true,
        [className]: className && className.length
    });

    return (
        <Portal targetId="dialog" isOpen={isOpen}>
            <section {...rest} className={classNames} role="dialog" tabIndex="0">
                <div className={theme.dialog__contentsPosition}>
                    <div className={theme.dialog__contents}>
                        <IconButton
                            icon="close"
                            className={theme.dialog__closeBtn}
                            id="neos__modal__closeModal"
                            onClick={e => executeCallback({e, cb: onRequestClose})}
                            />
                        <div className={theme.dialog__title}>
                            {title}
                        </div>

                        {children}

                        <div className={theme.dialog__actions}>
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
    theme: PropTypes.shape({
        'dialog': PropTypes.string,
        'dialog__contentsPosition': PropTypes.string,
        'dialog__contents': PropTypes.string,
        'dialog__title': PropTypes.string,
        'dialog__closeBtn': PropTypes.string,
        'dialog__actions': PropTypes.string,
        'dialog--wide': PropTypes.string
    }).isRequired
};

export default Dialog;
