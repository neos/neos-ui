// tslint:disable:max-classes-per-file
import React, {PureComponent, ReactNode} from 'react';
import {omit} from 'lodash';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

import { PickDefaultProps } from '../../types';
import ShallowDropDownHeader from './header';
import ShallowDropDownContents from './contents';

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
    readonly isOpen: boolean;

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
    readonly 'dropDown__btn': string;
    readonly 'dropDown--padded': string;
}

export const defaultProps: PickDefaultProps<DropDownWrapperProps, 'isOpen' | 'style'> = {
    isOpen: false,
    style: 'default'
};

interface DropDownWrapperState {
    readonly isOpen: boolean;
}

export default class DropDownWrapper extends PureComponent<DropDownWrapperProps, DropDownWrapperState> {
    public static readonly defaultProps = defaultProps;
    public state = {
        isOpen: this.props.isOpen
    };

    public render(): JSX.Element {
        return <StatelessDropDownWrapper {...this.props} isOpen={this.state.isOpen} onToggle={this.handleToggle} onClose={this.handleClose}/>;
    }

    private readonly handleToggle = (event: MouseEvent) => {
        if (this.props.onToggle) {
            this.props.onToggle(event);
        }

        this.setState({isOpen: !this.state.isOpen});
    }

    private handleClose = () => {
        this.setState({isOpen: false});
    }
}

export interface StatelessDropDownWrapperWithoutClickOutsideBehaviorProps extends DropDownWrapperProps {
    onToggle: (event: MouseEvent) => void;
    onClose: (event?: MouseEvent) => void;
}

export interface ChildContext {
    toggleDropDown: (event: MouseEvent) => void;
    closeDropDown: (event: MouseEvent) => void;
}

class StatelessDropDownWrapperWithoutClickOutsideBehavior extends PureComponent<StatelessDropDownWrapperWithoutClickOutsideBehaviorProps> {
    public static readonly defaultProps = defaultProps;

    public getChildContext = (): ChildContext => ({
        toggleDropDown: this.handleToggle,
        closeDropDown: this.handleClose,
    })

    public readonly handleClickOutside = () => {
        if (this.props.isOpen) {
            this.handleClose();
        }
    }

    public render(): JSX.Element {
        const {children, className, theme, style, padded, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen', 'onToggle', 'onClose']);
        // const styleClassName: string = style ? `dropDown--${style}` : '';
        const finalClassName = mergeClassNames(
            theme!.dropDown__btn,
            className,
            {
                [theme!['dropDown--padded']]: padded
            }
        );

        return (
            <div {...rest} className={finalClassName}>
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            ...child.props,
                            context: this.context
                        });
                    } else {
                        return child;
                    }
                })}
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



export interface ContextDropDownProps extends DropDownWrapperProps {
    isDropdownOpen?: boolean;
}

export class ContextDropDownHeader extends PureComponent<ContextDropDownProps> {
    public static contextTypes = {
        toggleDropDown: PropTypes.func.isRequired
    };

    public render(): JSX.Element {
        const {isDropdownOpen, ...rest} = this.props;

        return <ShallowDropDownHeader isOpen={isDropdownOpen} {...rest} {...this.context}/>;
    }
}
export class ContextDropDownContents extends PureComponent<ContextDropDownProps> {
    public static propTypes = {
        /**
         * The propagated isOpen state from the dropDown
         */
        isDropdownOpen: PropTypes.bool
    };

    public static contextTypes = {
        closeDropDown: PropTypes.func.isRequired
    };

    public render(): JSX.Element {
        const {isDropdownOpen, ...rest} = this.props;

        return <ShallowDropDownContents isOpen={isDropdownOpen} {...rest} {...this.context}/>;
    }
}
