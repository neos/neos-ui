import React, {PureComponent, ReactNode} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from '../enhanceWithClickOutside/index';

import { PickDefaultProps } from '../utils-typescript';
import ShallowDropDownHeader from './header';
import ShallowDropDownContents from './contents';
import PropTypes from 'prop-types';

export interface DropDownWrapperProps {
    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * An optional style variant (default, darker)
     */
    readonly style?: string;

    /**
     * An optional padding around the contents
     */
    readonly padded?: boolean;

    /**
     * This prop controls the initial visual opened state of the `DropDown`.
     */
    readonly isOpen?: boolean;

    /**
     * This callback gets called when the opened state toggles
     */
    readonly onToggle?: (event: MouseEvent) => void;

    /**
     * The contents to be rendered, ideally `DropDown.Header` and `DropDown.Contents`.
     */
    readonly children?: ReactNode;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: DropDownWrapperTheme;
}

interface DropDownWrapperTheme {
    readonly 'dropDown': string;
    readonly 'dropDown--padded': string;
    readonly 'dropDown__btn': string;
}

export const defaultProps: PickDefaultProps<DropDownWrapperProps, 'isOpen' | 'style'> = {
    isOpen: false,
    style: 'default'
};

export interface DropDownWrapperState {
    readonly isOpen: boolean;
}

export interface StatelessDropDownWrapperWithoutClickOutsideBehaviorProps extends DropDownWrapperProps {
    onToggle: (event: MouseEvent) => void;
    onClose: (event?: MouseEvent) => void;
}

export interface ChildContext {
    toggleDropDown: (event: MouseEvent) => void;
    closeDropDown: (event: MouseEvent) => void;
    wrapperRef: React.RefObject<HTMLDivElement>;
}

class StatelessDropDownWrapperWithoutClickOutsideBehavior extends PureComponent<StatelessDropDownWrapperWithoutClickOutsideBehaviorProps> {
    public static readonly defaultProps = defaultProps;

    public static readonly childContextTypes = {
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired,
        wrapperRef: PropTypes.object.isRequired
    };

    public readonly ref: React.RefObject<HTMLDivElement> = React.createRef();

    public readonly getChildContext = (): ChildContext => ({
        toggleDropDown: this.handleToggle,
        closeDropDown: this.handleClose,
        wrapperRef: this.ref
    })

    public readonly handleClickOutside = () => {
        if (this.props.isOpen) {
            this.handleClose();
        }
    }

    public render(): JSX.Element {
        const {children, className, theme, style, padded, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen', 'onToggle', 'onClose']);
        const styleClassName: string = style ? `dropDown--${style}` : '';
        const finalClassName = mergeClassNames(
            {
                // @ts-ignore
                [theme[styleClassName]]: styleClassName,
                [theme!['dropDown--padded']]: padded
            },
            theme!.dropDown,
            className,
        );

        return (
            <div ref={this.ref} {...rest} className={finalClassName}>
                {React.Children.map(
                    children,
                    // @ts-ignore
                    child => typeof child.type === 'string' ? child : <child.type {...child.props} isDropdownOpen={this.props.isOpen}/>
                )}
            </div>
        );
    }

    private readonly handleToggle = (event: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        this.props.onToggle(event);
    }

    private readonly handleClose = (event?: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        this.props.onClose(event);
    }
}

//
// Add the click-outside functionality to the StatelessDropDownWrapper component.
//
export const StatelessDropDownWrapper = enhanceWithClickOutside(StatelessDropDownWrapperWithoutClickOutsideBehavior);

export class DropDownWrapper extends PureComponent<DropDownWrapperProps, DropDownWrapperState> {
    public static readonly defaultProps = defaultProps;

    private updateIsOpenHandle: null | ReturnType<typeof setTimeout> = null;

    constructor(props: DropDownWrapperProps) {
        super(props);
        this.state = {
            isOpen: props.isOpen !== undefined ? props.isOpen : defaultProps.isOpen
        };
    }

    public componentWillUnmount(): void {
        if (this.updateIsOpenHandle !== null) {
            clearTimeout(this.updateIsOpenHandle);
        }
    }

    public render(): JSX.Element {
        return <StatelessDropDownWrapper {...this.props} isOpen={this.state.isOpen} onToggle={this.handleToggle} onClose={this.handleClose}/>;
    }

    //
    // Closing the DropDown removes the DropDown.Contents from the DOM. There may be DOM nodes inside the
    // DropDown.Contents that still need to receive events before that happens.
    //
    // This method makes sure that the DropDown closes only after the current call-stack has been
    // processed. This prevents behavior like the one described in: https://github.com/neos/neos-ui/issues/3305
    //
    private readonly updateIsOpen = (
        handlerFn: (isOpen: boolean) => boolean
    ) => {
        if (this.updateIsOpenHandle !== null) {
            clearTimeout(this.updateIsOpenHandle);
        }

        this.updateIsOpenHandle = setTimeout(() => {
            this.setState((state) => ({ isOpen: handlerFn(state.isOpen) }));
        }, 0);
    }

    private readonly handleToggle = (event: MouseEvent) => {
        if (this.props.onToggle) {
            this.props.onToggle(event);
        }

        this.updateIsOpen((isOpen) => !isOpen);
    }

    private readonly handleClose = () => {
        this.updateIsOpen(() => false);
    }
}

export default DropDownWrapper;

export interface ContextDropDownProps extends DropDownWrapperProps {
    isDropdownOpen?: boolean;
    wrapperRef?: React.RefObject<HTMLElement>;
}

export class ContextDropDownHeader extends PureComponent<ContextDropDownProps> {
    public static readonly contextTypes = {
        toggleDropDown: PropTypes.func.isRequired
    };

    public render(): JSX.Element {
        const {isDropdownOpen, ...rest} = this.props;

        return <ShallowDropDownHeader isOpen={isDropdownOpen} {...rest} {...this.context}/>;
    }
}

export class ContextDropDownContents extends PureComponent<ContextDropDownProps> {
    public static readonly contextTypes = {
        closeDropDown: PropTypes.func.isRequired,
        wrapperRef: PropTypes.object.isRequired
    };

    public render(): JSX.Element {
        const {isDropdownOpen, wrapperRef, ...rest} = this.props;

        return <ShallowDropDownContents isOpen={isDropdownOpen} {...rest} {...this.context} wrapperRef={wrapperRef || this.context.wrapperRef}/>;
    }
}
