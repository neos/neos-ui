import mergeClassNames from 'classnames';
import {omit} from 'lodash';
import React, {PureComponent, ReactNode} from 'react';
import CloseOnEscape from 'react-close-on-escape';
import Portal from 'react-portal';

import IconButton from '../IconButton';

type DialogStyle = 'wide' | 'narrow';

interface DialogTheme {
    readonly 'dialog': string;
    readonly 'dialog__body': string;
    readonly 'dialog__contentsPosition': string;
    readonly 'dialog__contents': string;
    readonly 'dialog__backDrop': string;
    readonly 'dialog__title': string;
    readonly 'dialog__closeBtn': string;
    readonly 'dialog__actions': string;
    readonly 'dialog--wide': string;
    readonly 'dialog--narrow': string;
}

export interface DialogProps {
    /**
     * This prop controls the rendered state of the Dialog, when falsy, nothing gets rendered into the DOM.
     */
    readonly isOpen: boolean;

    /**
     * The handler which gets called once the user clicks on the close symbol in the top right corner of the Dialog.
     */
    readonly onRequestClose: () => void;

    /**
     * The title to be rendered on top of the Dialogs contents.
     */
    readonly title: ReactNode;

    /**
     * The `style` prop defines the visual style of the `Dialog`.
     */
    readonly style: DialogStyle;

    /**
     * The contents to be rendered within the Dialog.
     */
    readonly children: ReactNode;

    /**
     * An Array of nodes(e.g. Action Buttons) which are placed at the bottom of the Dialog.
     */
    readonly actions: ReadonlyArray<ReactNode>;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * An optional `contentsClassName` to attach to the content area of the dialog.
     */
    readonly contentsClassName?: string;

    /**
     * An optional css theme to be injected.
     */
    readonly theme: DialogTheme;
}

export class DialogWithoutEscape extends PureComponent<DialogProps> {
    public render(): JSX.Element {
        const {
            className,
            title,
            style,
            children,
            isOpen,
            onRequestClose,
            actions,
            theme,
            ...restProps
        } = this.props;

        const rest = omit(restProps, ['isOpen']); // TODO: ?

        const finalClassName = mergeClassNames(
            theme.dialog,
            {
                [theme['dialog--wide']]: style === 'wide',
                [theme['dialog--narrow']]: style === 'narrow',
            },
            className,
        );

        const finalClassNameBody = mergeClassNames(
            theme.dialog__body,
            'dialog__body'
        );

        const backDropClassName = mergeClassNames(
            theme.dialog__backDrop,
            'dialog__backDrop'
        );

        return (
            <Portal isOpened={isOpen}>
                <section {...rest} className={finalClassName} role="dialog" tabIndex={0}>
                    <div className={backDropClassName} role="button" onClick={onRequestClose}/>
                    <div className={theme.dialog__contentsPosition}>
                        <div className={theme.dialog__contents}>
                            {onRequestClose && (
                                <IconButton
                                    icon="times"
                                    className={theme.dialog__closeBtn}
                                    onClick={onRequestClose}
                                    size="regular"
                                    style="brand"
                                    hoverStyle="darken"
                                    autoFocus={true}
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

// tslint:disable-next-line:max-classes-per-file
class DialogWithEscape extends PureComponent<DialogProps> {
    public render(): JSX.Element {
        return (
            <CloseOnEscape onEscape={this.onEscape}>
                <DialogWithoutEscape {...this.props}/>
            </CloseOnEscape>
        );
    }

    private readonly onEscape = () => {
        this.props.onRequestClose();
    }
}

export default DialogWithEscape;
