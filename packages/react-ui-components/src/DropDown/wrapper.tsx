// tslint:disable:max-classes-per-file
import React, {PureComponent, ReactNode} from 'react';
import {omit} from 'lodash';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import ShallowDropDownHeader from './header';
import ShallowDropDownContents from './contents';
import * as PropTypes from 'prop-types';
import { PickDefaultProps } from '../../types';

interface WrapperTheme {
    readonly 'dropDown': string;
    readonly 'dropDown__btn': string;
    readonly 'dropDown--padded': string;
}

export interface WrapperProps {
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
    readonly theme?: WrapperTheme;
}

type DefaultProps = PickDefaultProps<WrapperProps,
    'isOpen' |
    'style'
>;

export const defaultProps: DefaultProps = {
    isOpen: false,
    style: 'default'
};

export interface StatelessDropDownWrapperWithoutClickOutsideBehaviorProps extends WrapperProps {
    onToggle: (event: MouseEvent) => void;
    onClose: (event: MouseEvent) => void;
}

export interface ChildContextTypesProps extends StatelessDropDownWrapperWithoutClickOutsideBehaviorProps {
    toggleDropDown: (event: MouseEvent) => void;
    closeDropDown: (event: MouseEvent) => void;
}

class StatelessDropDownWrapperWithoutClickOutsideBehavior extends PureComponent<StatelessDropDownWrapperWithoutClickOutsideBehaviorProps> {
    public static readonly defaultProps = defaultProps;

    protected readonly handleToggle = (event: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }

        this.props.onToggle(event);
    }

    protected readonly handleClickOutside = (event: MouseEvent) => {
        if (this.props.isOpen) {
            this.handleClose(event);
        }
    }

    protected readonly handleClose = (event: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        this.props.onClose(event);
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
}

//
// Add the click-outside functionality to the StatelessDropDownWrapper component.
//
export const StatelessDropDownWrapper = enhanceWithClickOutside(StatelessDropDownWrapperWithoutClickOutsideBehavior);

export class DropDownWrapper extends PureComponent<WrapperProps> {
    public static readonly defaultProps = defaultProps;

    public state = {
        isOpen: Boolean(this.props.isOpen)
    };

    public handleToggle = (event: MouseEvent) => {
        if (this.props.onToggle) {
            this.props.onToggle(event);
        }

        this.setState({isOpen: !this.state.isOpen});
    }

    public handleClose = () => {
        this.setState({isOpen: false});
    }

    public render(): JSX.Element {
        return <StatelessDropDownWrapper {...this.props} isOpen={this.state.isOpen} onToggle={this.handleToggle} onClose={this.handleClose}/>;
    }
}

export default DropDownWrapper;

export interface ContextDropDownProps extends WrapperProps {
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
