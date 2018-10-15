import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';
import Portal from 'react-portal';
import CloseOnEscape from 'react-close-on-escape';

const validStyleKeys = ['wide', 'narrow'];

export class DialogWithoutEscape extends PureComponent {
    static propTypes = {
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

    render() {
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
        } = this.props;
        const rest = omit(restProps, ['isOpen']);
        const finalClassName = mergeClassNames({
            [theme.dialog]: true,
            [theme['dialog--wide']]: style === 'wide',
            [theme['dialog--narrow']]: style === 'narrow',
            [className]: className && className.length
        });
        const finalClassNameBody = mergeClassNames({
            [theme.dialog__body]: Boolean(theme.dialog__body), // set only if it's not a faulty value
            'dialog__body': true
        });

        return (
            <Portal isOpened={isOpen}>
                <section {...rest} className={finalClassName} role="dialog" tabIndex="0">
                    <div className={theme.dialog__contentsPosition}>
                        <div className={theme.dialog__contents}>
                            {onRequestClose && (
                                <IconButtonComponent
                                    icon="times"
                                    className={theme.dialog__closeBtn}
                                    onClick={onRequestClose}
                                    />
                            )}
                            <div className={theme.dialog__title}>
                                {title}
                            </div>

                            <div className={finalClassNameBody}>
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
    }
}

class DialogWithEscape extends PureComponent {
    static propTypes = {
        onRequestClose: PropTypes.func.isRequired
    };

    onEscape = () => {
        const {onRequestClose} = this.props;
        onRequestClose();
    }

    render() {
        return (
            <CloseOnEscape onEscape={this.onEscape}><DialogWithoutEscape {...this.props}/></CloseOnEscape>
        );
    }
}

export default DialogWithEscape;
