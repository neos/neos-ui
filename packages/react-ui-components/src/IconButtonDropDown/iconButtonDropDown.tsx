import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import {PickDefaultProps} from '../../types';
import Button from '../Button';
import {ButtonProps} from '../Button/button';
import Icon from '../Icon';
import DropDownItem from './dropDownItem';

type DropDownId = string;

interface IconButtonDropDownTheme {
    readonly 'wrapper': string;
    readonly 'wrapper__btn': string;
    readonly 'wrapper__btnModeIcon': string;
    readonly 'wrapper__dropDown': string;
    readonly 'wrapper__dropDown--isOpen': string;
    readonly 'wrapper__dropDownItem': string;
    readonly 'wrapper__btnIcon': string;
}

export interface IconButtonDropDownProps {
    /**
     * The key of the Icon which is always displayed.
     */
    readonly icon: string;

    /**
     * Children to be rendered inside the DropDown.
     */
    readonly children: ReadonlyArray<
        React.ReactElement<{
            readonly dropDownId: string;
        }>
    >;

    /**
     * You can pass an modeIcon which displays the current selected item in a leaner way.
     * Modify this prop via listening to the `onItemSelect` propType.
     */
    readonly modeIcon: string;

    /**
     * Will be called once the user clicks on the wrapper if
     * it is NOT opened right meow.
     */
    readonly onClick: () => void;

    /**
     * Will be called once the user selects an item.
     * You should specify an `dropDownId` prop on each child,
     * which will then be propagated to this handler as the first
     * and only argument.
     */
    readonly onItemSelect: (id: DropDownId) => void;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: IconButtonDropDownTheme;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * Controls the whole components disabled state.
     */
    readonly disabled: boolean;

    /**
     * Props which are propagated to the <Button> component.
     */
    readonly directButtonProps: ButtonProps;
}

type DefaultProps = PickDefaultProps<IconButtonDropDownProps, 'directButtonProps' | 'disabled' | 'modeIcon'>;

export const defaultProps: DefaultProps = {
    directButtonProps: {
        children: undefined,
        size: 'regular',
    },
    disabled: false,
    modeIcon: 'long-arrow-right',
};

export interface IconButtonDropDownState {
    readonly isOpen: boolean;
}

const initialState: IconButtonDropDownState = {
    isOpen: false,
};

export default class IconButtonDropDown extends PureComponent<IconButtonDropDownProps, IconButtonDropDownState> {
    // tslint:disable:readonly-keyword
    private _timeouts: {
        hold?: number,
        hover?: number
    };
    // tslint:enable:readonly-keyword

    constructor(props: IconButtonDropDownProps) {
        super(props);

        this.state = initialState;

        this._timeouts = {
            hold: undefined,
            hover: undefined
        };
    }

    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            className,
            disabled,
            icon,
            modeIcon,
            theme,
            directButtonProps,
            children
        } = this.props;
        const {isOpen} = this.state;
        const finalClassName = mergeClassNames(className, theme!.wrapper);
        const dropDownClassNames = mergeClassNames(
            theme!.wrapper__dropDown,
            {
                [theme!['wrapper__dropDown--isOpen']]: isOpen,
            }
        );

        const {size, ...rest} = directButtonProps;

        return (
            <div className={finalClassName} onMouseLeave={this.handleMouseLeave}>
                <Button
                    {...rest}
                    style="clean"
                    hoverStyle="clean"
                    aria-haspopup="true"
                    className={theme!.wrapper__btn}
                    disabled={disabled}
                    onMouseDown={this.handleHoldTimeout}
                    onMouseEnter={this.handleHoverTimeout}
                    onFocus={this.handleHoverTimeout}
                    onClick={this.handleClick}
                    size={size}
                >
                    <Icon icon={modeIcon} className={theme!.wrapper__btnModeIcon}/>
                    <Icon icon={icon} className={theme!.wrapper__btnIcon}/>
                </Button>
                <div className={dropDownClassNames} aria-hidden={isOpen ? 'false' : 'true'}>
                    {children.map((child, index) => (
                        <DropDownItem
                            key={index}
                            className={theme!.wrapper__dropDownItem}
                            onClick={this.createItemSelectedHandler(child.props.dropDownId)}
                            id={child.props.dropDownId}
                        >
                            {child}
                        </DropDownItem>
                    ))}
                </div>
            </div>
        );
    }

    private readonly createHoldTimeout = () => {
        this.cancelHoldTimeout();
        // tslint:disable-next-line:no-object-mutation
        this._timeouts.hold = window.setTimeout(() => this.openDropDown(), 200);
    }

    private readonly cancelHoldTimeout = () => {
        window.clearTimeout(this._timeouts.hold);
    }

    private readonly createHoverTimeout = () => {
        this.cancelHoverTimeout();
        // tslint:disable-next-line:no-object-mutation
        this._timeouts.hover = window.setTimeout(() => this.openDropDown(), 700);
    }

    private readonly cancelHoverTimeout = () => {
        window.clearTimeout(this._timeouts.hover);
    }

    private readonly handleHoverTimeout = () => this.createHoverTimeout();

    private readonly handleHoldTimeout = () => this.createHoldTimeout();

    private readonly handleClick = () => {
        const {isOpen} = this.state;
        this.cancelHoldTimeout();
        this.cancelHoverTimeout();

        if (!isOpen) {
            this.props.onClick();
        }
    }

    private readonly handleMouseLeave = () => {
        this.cancelHoldTimeout();
        this.cancelHoverTimeout();
        this.closeDropDown();
    }

    private readonly createItemSelectedHandler = (dropDownId: DropDownId) => () => {
        this.props.onItemSelect(dropDownId);
        this.closeDropDown();
    }

    private readonly openDropDown = () => {
        this.setState({isOpen: true});
    }

    private readonly closeDropDown = () => {
        this.setState({isOpen: false});
    }
}
