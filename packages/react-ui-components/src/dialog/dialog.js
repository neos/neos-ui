import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';

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
        PortalComponent,
        IconButtonComponent,
        ...restProps
    } = props;
    const rest = omit(restProps, ['isOpen']);
    const finalClassName = mergeClassNames({
        [theme.dialog]: true,
        [theme['dialog--wide']]: wide,
        [className]: className && className.length
    });

    return (
        <PortalComponent targetId="dialog" isOpen={isOpen}>
            <section {...rest} className={finalClassName} role="dialog" tabIndex="0">
                <div className={theme.dialog__contentsPosition}>
                    <div className={theme.dialog__contents}>
                        <IconButtonComponent
                            icon="close"
                            className={theme.dialog__closeBtn}
                            onClick={onRequestClose}
                            />
                        <div className={theme.dialog__title}>
                            {title}
                        </div>

                        {children}

                        <div className={theme.dialog__actions}>
                            {React.Children.map(actions, (action, index) => <span key={index}>{action}</span>)}
                        </div>
                    </div>
                </div>
            </section>
        </PortalComponent>
    );
};
Dialog.propTypes = {
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
     * When truthy, the Dialog gets rendered in bigger dimensions.
     *
     * @todo Rename this prop into `isWide` to make it more clear that it needs to be a bool.
     */
    wide: PropTypes.bool,

    /**
     * The contents to be rendered within the Dialog.
     */
    children: PropTypes.any.isRequired,

    /**
     * An Array of nodes(e.g. Action Buttons) which are placed at the bottom of the Dialog.
     */
    actions: PropTypes.any.isRequired,

    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

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
        'dialog--wide': PropTypes.string
    }).isRequired,

    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    PortalComponent: PropTypes.any.isRequired,
    IconButtonComponent: PropTypes.any.isRequired
};

export default Dialog;
