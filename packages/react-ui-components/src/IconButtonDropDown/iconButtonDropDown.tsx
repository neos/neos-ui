import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import {IButtonProps} from '../Button/button';
import DropDownItem from './dropDownItem';

type DropDownId = string;

interface IIconButtonDropDownTheme {
    readonly 'wrapper': string;
    readonly 'wrapper__btn': string;
    readonly 'wrapper__btnModeIcon': string;
    readonly 'wrapper__dropDown': string;
    readonly 'wrapper__dropDown--isOpen': string;
    readonly 'wrapper__dropDownItem': string;
    readonly [key: string]: string;
}

interface IIconButtonDropDownProps {
    /**
     * The key of the Icon which is always displayed.
     */
    readonly icon: string;

    // TODO: be more specific
    // TODO: use render prop
    /**
     * Children to be rendered inside the DropDown.
     */
    readonly children: ReadonlyArray<React.ReactElement<{
        readonly dropDownId: string;
    }>>;

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
    readonly theme?: IIconButtonDropDownTheme;

    // TODO: This feels strange. We should just import the component classes here.
    // also those interfaces should be exposed (export interface ...)
    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    readonly IconComponent: React.ComponentClass<{
        readonly icon: string;
        readonly className?: string;
    }>;

    readonly ButtonComponent: React.ComponentClass<IButtonProps>;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * Controls the whole components disabled state.
     */
    readonly isDisabled: boolean;

    // we can remove this if we should import and use the _actual_ component
    /**
     * Props which are propagated to the <Button> component.
     */
    readonly directButtonProps: Partial<IButtonProps>;
}

interface IIconButtonDropDownState {
    readonly isOpen: boolean;
    readonly mouseHoldTimeout: number | undefined;
    readonly mouseHoverTimeout: number | undefined;
}

export default class IconButtonDropDown extends PureComponent<IIconButtonDropDownProps, IIconButtonDropDownState> {
    constructor(props: IIconButtonDropDownProps) {
        super(props);

        this.state = {
            isOpen: false,
            mouseHoldTimeout: undefined,
            mouseHoverTimeout: undefined,
        };
    }

    public static readonly defaultProps: Partial<IIconButtonDropDownProps> = {
        directButtonProps: {},
        isDisabled: false,
        modeIcon: 'long-arrow-right',
    };

    public render(): JSX.Element {
        const {
            IconComponent,
            ButtonComponent,
            className,
            isDisabled,
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
                <ButtonComponent
                    {...rest}
                    style="clean"
                    hoverStyle="clean"
                    aria-haspopup="true"
                    className={theme!.wrapper__btn}
                    isDisabled={isDisabled}
                    onMouseDown={this.handleHoldTimeout}
                    onMouseEnter={this.handleHoverTimeout}
                    onFocus={this.handleHoverTimeout}
                    onClick={this.handleClick}
                    size={size!}
                >
                    <IconComponent icon={modeIcon} className={theme!.wrapper__btnModeIcon}/>
                    <IconComponent icon={icon} className={theme!.wrapper__btnIcon}/>
                </ButtonComponent>
                <div className={dropDownClassNames} aria-hidden={isOpen ? 'false' : 'true'}>
                    {children.map((child) => (
                        <DropDownItem
                            key={child.props.dropDownId}
                            className={theme!.wrapper__dropDownItem}
                            onClick={this.handleItemSelected}
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
        this.setState({
            mouseHoldTimeout: window.setTimeout(() => this.openDropDown(), 200),
        });
    }

    private readonly cancelHoldTimeout = () => {
        const {mouseHoldTimeout} = this.state;

        if (mouseHoldTimeout) {
            clearTimeout(mouseHoldTimeout);
            this.setState({
                mouseHoldTimeout: undefined,
            });
        }
    }

    private readonly createHoverTimeout = () => {
        this.setState({
            mouseHoverTimeout: window.setTimeout(() => this.openDropDown(), 700),
        });
    }

    private readonly cancelHoverTimeout = () => {
        const {mouseHoverTimeout} = this.state;

        if (mouseHoverTimeout) {
            clearTimeout(mouseHoverTimeout);
            this.setState({
                mouseHoverTimeout: undefined,
            });
        }
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

    private readonly handleItemSelected = (ref: DropDownId) => {
        this.props.onItemSelect(ref);
        this.closeDropDown();
    }

    private readonly openDropDown = () => {
        this.setState({isOpen: true});
    }

    private readonly closeDropDown = () => {
        this.setState({isOpen: false});
    }
}
