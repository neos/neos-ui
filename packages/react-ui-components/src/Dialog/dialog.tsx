import mergeClassNames from 'classnames';
import React, {PureComponent, ReactNode} from 'react';
import enhanceWithClickOutside from '../enhanceWithClickOutside/index';
import CloseOnEscape from 'react-close-on-escape';
import {Portal} from 'react-portal';

type DialogType = 'success' | 'warn' | 'error';
type DialogStyle = 'wide' | 'narrow';

interface DialogTheme {
    readonly 'dialog': string;
    readonly 'dialog__body': string;
    readonly 'dialog__contentsPosition': string;
    readonly 'dialog__contents': string;
    readonly 'dialog__title': string;
    readonly 'dialog__closeBtn': string;
    readonly 'dialog__actions': string;
    readonly 'dialog--wide': string;
    readonly 'dialog--narrow': string;
    readonly 'dialog--success': string;
    readonly 'dialog--warn': string;
    readonly 'dialog--error': string;
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
     * The `type` prop defines the type of the `Dialog`.
     */
    readonly type: DialogType;

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
     * This prop controls the focus state of the Dialog.
     */
    readonly autoFocus: boolean;

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
    // tslint:disable-next-line:readonly-keyword
    private ref?: HTMLDivElement;

    public render(): JSX.Element {
        const {
            title,
            children,
            actions,
            theme,
            type
        } = this.props;

        const finalClassNameBody = mergeClassNames(
            theme.dialog__body,
            {
                [theme['dialog--success']]: type === 'success',
                [theme['dialog--warn']]: type === 'warn',
                [theme['dialog--error']]: type === 'error',
            },
            'dialog__body'
        );

        return (
            <div ref={this.handleReference} className={theme.dialog__contentsPosition} tabIndex={0}>
                <div className={theme.dialog__contents}>

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
        );
    }

    private readonly handleReference = (ref: HTMLDivElement) => {
        // tslint:disable-next-line:no-object-mutation
        this.ref = ref;
    }

    public readonly handleClickOutside = () => {
        this.props.onRequestClose();
    }

    public readonly componentDidMount = (): void => {
        document.addEventListener('keydown', (event : KeyboardEvent) => this.handleKeyPress(event));
        const {autoFocus} = this.props;
        if (this.ref && autoFocus) {
            this.ref.focus();
        }
    }

    public readonly componentWillUnmount = (): void => {
        document.removeEventListener('keydown', (event : KeyboardEvent) => this.handleKeyPress(event));
    }

    /**
     * Closes the dialog when the escape key has been pressed.
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    public readonly handleKeyPress = (event : KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.props.onRequestClose();
        }
    }
}

const EnhancedDialogWithoutEscapeWithClickOutside = enhanceWithClickOutside(DialogWithoutEscape);

// tslint:disable-next-line:max-classes-per-file
class DialogWithEscape extends PureComponent<DialogProps> {
    public render(): JSX.Element | null {
        const {
            className,
            title,
            style,
            children,
            isOpen,
            actions,
            theme,
            type,
            onRequestClose,
            ...rest
        } = this.props;

        const sectionClassName = mergeClassNames(
            theme.dialog,
            {
                [theme['dialog--wide']]: style === 'wide',
                [theme['dialog--narrow']]: style === 'narrow',
            },
            {
                [theme['dialog--success']]: type === 'success',
                [theme['dialog--warn']]: type === 'warn',
                [theme['dialog--error']]: type === 'error',
            },
            className,
        );

        if (!this.props.isOpen) {
            return null;
        }

        return (
            <CloseOnEscape onEscape={this.onEscape}>
                <Portal>
                    <section {...rest} className={sectionClassName} role="dialog" tabIndex={0}>
                        <EnhancedDialogWithoutEscapeWithClickOutside {...this.props}/>
                    </section>
                </Portal>
            </CloseOnEscape>
        );
    }

    private readonly onEscape = () => {
        this.props.onRequestClose();
    }
}

export default DialogWithEscape;
