import mergeClassNames from 'classnames';
import React, {PureComponent, ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {Dialog, DialogManager} from './DialogManager';

type DialogType = 'success' | 'warn' | 'error';
type DialogStyle = 'wide' | 'jumbo' | 'narrow';

interface DialogTheme {
    readonly 'dialog': string;
    readonly 'dialog__body': string;
    readonly 'dialog__contentsPosition': string;
    readonly 'dialog__contents': string;
    readonly 'dialog__title': string;
    readonly 'dialog__closeBtn': string;
    readonly 'dialog__actions': string;
    readonly 'dialog--wide': string;
    readonly 'dialog--jumbo': string;
    readonly 'dialog--narrow': string;
    readonly 'dialog--success': string;
    readonly 'dialog--warn': string;
    readonly 'dialog--error': string;
    readonly 'dialog--effect__shake': string;
}

export interface DialogProps {
    /**
     * This prop controls the rendered state of the Dialog, when falsy, nothing gets rendered into the DOM.
     */
    readonly isOpen: boolean;

    /**
     * An optional handler, which gets called once the user clicks on the close symbol in the top right corner of the Dialog.
     */
    readonly onRequestClose?: () => void;

    /**
     * An optional boolean flag to keep the user in the dialog.
     */
    readonly preventClosing?: boolean;

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

const dialogManager = new DialogManager({
    eventRoot: document
});

class DialogWithOverlay extends PureComponent<DialogProps> {
    // tslint:disable-next-line:readonly-keyword
    private ref?: HTMLDivElement;

    private dialog: Dialog = {
        close: () => {
            if (this.props.preventClosing) {
                this.startShaking();
                return false;
            }
            if (this.props.onRequestClose) {
                this.props.onRequestClose();
            }
            return true;
        }
    };

    public state: Readonly<{
        isShaking: boolean
    }> = {
        isShaking: false
    };

    private startShaking = () => {
        if (this.state.isShaking) {
            return;
        }
        this.setState({
            isShaking: true
        });
        setTimeout(() => {
            this.setState({
                isShaking: false
            });
        }, 820);
    }

    public renderDialogWithoutOverlay(): JSX.Element {
        const {title, children, actions, theme, type} = this.props;

        const finalClassNameBody = mergeClassNames(
            theme.dialog__body,
            this.state.isShaking ? theme['dialog--warn'] : {
                [theme['dialog--success']]: type === 'success',
                [theme['dialog--warn']]: type === 'warn',
                [theme['dialog--error']]: type === 'error'
            },
            'dialog__body'
        );

        return (
            <div
                ref={this.handleReference}
                className={theme.dialog__contentsPosition}
                tabIndex={0}
            >
                <div className={mergeClassNames(
                    theme.dialog__contents,
                    this.state.isShaking && theme['dialog--effect__shake']
                )}>
                    <div className={theme.dialog__title}>{title}</div>
                    <div className={finalClassNameBody}>{children}</div>

                    {actions && actions.length ? (
                        <div className={theme.dialog__actions}>
                            {React.Children.map(actions, (action, index) => (
                                <span key={index}>{action}</span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    private readonly handleReference = (ref: HTMLDivElement) => {
        // tslint:disable-next-line:no-object-mutation
        this.ref = ref;
    }

    public readonly componentDidMount = (): void => {
        const {autoFocus} = this.props;
        if (this.ref && autoFocus) {
            this.ref.focus();
        }

        dialogManager.register(this.dialog);
    }

    public readonly componentWillUnmount = (): void => {
        dialogManager.forget(this.dialog);
    }

    public render(): JSX.Element | null {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const {
            className,
            title,
            style,
            children,
            isOpen,
            actions,
            theme,
            type,
            preventClosing,
            onRequestClose,
            ...rest
        } = this.props;
        /* eslint-enable @typescript-eslint/no-unused-vars */

        const sectionClassName = mergeClassNames(
            theme.dialog,
            {
                [theme['dialog--wide']]: style === 'wide',
                [theme['dialog--jumbo']]: style === 'jumbo',
                [theme['dialog--narrow']]: style === 'narrow'
            },
            this.state.isShaking ? theme['dialog--warn'] : {
                [theme['dialog--success']]: type === 'success',
                [theme['dialog--warn']]: type === 'warn',
                [theme['dialog--error']]: type === 'error'
            },
            className,
        );

        if (!this.props.isOpen) {
            return null;
        }

        return createPortal(
            <section
                {...rest}
                className={sectionClassName}
                role="dialog"
                tabIndex={0}
                onClick={this.handleOverlayClick}
            >
                {this.renderDialogWithoutOverlay()}
            </section>,
            document.body
        );
    }

    private readonly handleOverlayClick = (ev: React.MouseEvent) => {
        if (ev.target === ev.currentTarget) {
            this.dialog.close();
        }
    }
}

export default DialogWithOverlay;
