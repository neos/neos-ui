import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';
import Portal from 'react-portal';
import CloseOnEscape from 'react-close-on-escape';

const validStyleKeys = ['wide', 'narrow'];

export const DialogWithoutEscape = props => {
    const {
        className,
        title,
        style,
        children,
        isOpen,
        onRequestClose,
        actions,
        theme,
        IconButtonComponent,
        ...restProps
    } = props;
    const rest = omit(restProps, ['isOpen']);
    const finalClassName = mergeClassNames({
        [theme.dialog]: true,
        [theme['dialog--wide']]: style === 'wide',
        [theme['dialog--narrow']]: style === 'narrow',
        [className]: className && className.length
    });

    return (
        <Portal isOpened={isOpen}>
            <section {...rest} className={finalClassName} role="dialog" tabIndex="0">
                <div className={theme.dialog__contentsPosition}>
                    <div className={theme.dialog__contents}>
                        {onRequestClose &&
                        <IconButtonComponent
                            icon="close"
                            className={theme.dialog__closeBtn}
                            onClick={onRequestClose}
                            />
                          }
                        <div className={theme.dialog__title}>
                            {title}
                        </div>

                        <div className={theme.dialog__body}>
                            {children}
                        </div>

                        {actions && actions.length ?
                            <div className={theme.dialog__actions}>
                                {React.Children.map(actions, (action, index) => <span key={index}>{action}</span>)}
                            </div> : null
                        }
                    </div>
                </div>
            </section>
        </Portal>
    );
};
DialogWithoutEscape.propTypes = {
    /**
     * This prop controls the rendered state of the Dialog, when falsy, nothing gets rendered into the DOM.
     */
    isOpen: PropTypes.bool.isRequired,

    /**
     * The handler which gets called once the user clicks on the close symbol in the top right corner of the Dialog.
     */
    onRequestClose: PropTypes.func.isRequired,

    /**
     * The title to be rendered on top of the Dialogs contents.
     */
    title: PropTypes.any,

    /**
     * The `style` prop defines the visual style of the `Dialog`.
     */
    style: PropTypes.oneOf(validStyleKeys),

    /**
     * The contents to be rendered within the Dialog.
     */
    children: PropTypes.any.isRequired,

    /**
     * An Array of nodes(e.g. Action Buttons) which are placed at the bottom of the Dialog.
     */
    actions: PropTypes.any,

    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * An optional `contentsClassName` to attach to the content area of the dialog.
     */
    contentsClassName: PropTypes.string,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        'dialog': PropTypes.string,
        'dialog__contentsPosition': PropTypes.string,
        'dialog__contents': PropTypes.string,
        'dialog__title': PropTypes.string,
        'dialog__closeBtn': PropTypes.string,
        'dialog__actions': PropTypes.string,
        'dialog--wide': PropTypes.string,
        'dialog--narrow': PropTypes.string
    }).isRequired,

    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    IconButtonComponent: PropTypes.any.isRequired
};

const DialogWithEscape = props => {
    const onEscape = () => props.onRequestClose();
    return (
        <CloseOnEscape onEscape={onEscape}><DialogWithoutEscape {...props}/></CloseOnEscape>
    );
};
DialogWithEscape.propTypes = {
    onRequestClose: PropTypes.func.isRequired
};

export default DialogWithEscape;
