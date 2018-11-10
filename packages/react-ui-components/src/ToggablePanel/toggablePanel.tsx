import React, {PureComponent, ReactElement, ReactNode} from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';
import {PickDefaultProps} from '../../types';
import IconButton from '../IconButton';
import Headline from '../Headline';

import ThemedHeader from './header.index';
import ThemedContents from './contents.index';
// import {IconButtonProps} from "../IconButton/iconButton";

const validStyleKeys = ['condensed'];

export interface ToggablePanelProps {
    /**
     * This prop controls if the contents are visible or not.
     */
    readonly isOpen?: boolean;

    /**
     * Switches icon-open and icon-closed if set to true; can be used for
     * panels that close downwards such as the page structure tree.
     */
    readonly closesToBottom?: boolean;

    /**
     * The children, ideally one Header and Contents component each.
     */
    readonly children: ReadonlyArray<ReactElement<any>>;

    /**
     * The handler which will be called once the user toggles the contents.
     */
    readonly onPanelToggle: () => void;

    readonly theme?: ToggablePanelTheme;
}

export const toggablePanelDefaultProps: PickDefaultProps<ToggablePanelProps, 'isOpen'> = {
    isOpen: true
};

interface ToggablePanelTheme {
    readonly panel: string;
    readonly 'panel--isOpen': string;
    readonly 'panel__headline': string;
    readonly 'panel__contents': string;
}

export interface ToggablePanelState {
    readonly isOpen: boolean;
}

export default class ToggablePanel extends PureComponent<ToggablePanelProps> {
    public state: ToggablePanelState = {
        isOpen: true
    };

    public static Header = ThemedHeader;
    public static Contents = ThemedContents;

    public static defaultProps = toggablePanelDefaultProps;

    public componentWillReceiveProps(newProps: ToggablePanelProps): void {
        const {isOpen} = newProps;
        const isStateLess = Boolean(newProps.onPanelToggle);

        if (isOpen !== this.state.isOpen && !isStateLess) {
            this.setState({isOpen});
        }
    }

    public toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    public render(): JSX.Element {
        //
        // If the `onPanelToggle` prop is provided, the component will not
        // be using internal state, instead it will be controlled by the props.
        //
        const isStateLess = Boolean(this.props.onPanelToggle);
        const onPanelToggle = isStateLess ? this.props.onPanelToggle : this.toggle;
        const isOpen = isStateLess ? this.props.isOpen : this.state.isOpen;

        return (
            <StatelessToggablePanel
                isOpen={isOpen}
                onPanelToggle={onPanelToggle}
                >
                {this.props.children}
            </StatelessToggablePanel>
        );
    }
}

export interface StatelessToggablePanelProps {
    /**
     * This prop controls if the contents are visible or not.
     */
    readonly isOpen?: boolean;

    /**
     * Switches icon-open and icon-closed if set to true; can be used for
     * panels that close downwards such as the page structure tree.
     */
    readonly closesToBottom?: boolean;

    /**
     * An optional className to render on the wrapper.
     */
    readonly className?: string;

    /**
     * The children, ideally one Header and Contents component each.
     */
    readonly children: ReadonlyArray<ReactElement<any>>;

    /**
     * The handler which will be called once the user toggles the contents.
     */
    readonly onPanelToggle: () => void;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: StatelessToggablePanelTheme;

    /**
     * The `style` prop defines the regular visual style of the `Button`.
     */
    readonly style?: ReadonlyArray<string>;
}

const statelessToggablePanelDefaultProps: PickDefaultProps<StatelessToggablePanelProps, 'isOpen'> = {
    isOpen: false
}

interface StatelessToggablePanelTheme {
    readonly 'panel': string;
    readonly 'panel--isOpen': string;
    readonly 'panel--condensed': string;
}

// tslint:disable-next-line:max-classes-per-file
export class StatelessToggablePanel extends PureComponent<StatelessToggablePanelProps> {
    public static defaultProps = statelessToggablePanelDefaultProps;

    public static childContextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    public getChildContext(): object {
        return {
            onPanelToggle: this.props.onPanelToggle
        };
    }

    public render(): JSX.Element {
        const {children, className, theme, style, isOpen} = this.props;
        const finalClassName = mergeClassNames({
            [className!]: className && className.length,
            [theme!.panel]: true,
            [theme!['panel--isOpen']]: isOpen,
            // @ts-ignore
            [theme![`panel--${style}`]]: validStyleKeys.includes(style)
        });

        return (
            <section className={finalClassName}>
                {children.map(child => child.type ? <child.type {...child.props} isPanelOpen={isOpen}/> : child)}
            </section>
        );
    }
}

export interface HeaderProps {
    /**
     * The children which will be rendered within the header.
     */
    children: ReactNode;

    /**
     * The propagated isOpen state from the toggle panel
     */
    isPanelOpen?: boolean;

    /**
     * An optional css theme to be injected.
     */
    theme?: HeaderTheme;

    /**
     * Can be set to remove padding from the content area
     */
    noPadding?: boolean;

    /**
     * Optional icons as closing/opening indicator
     * If not provided defaults are chevron-up and chevron-down
     */
    openedIcon: string;
    closedIcon: string;
    toggleButtonId?: string;
}

export const headerDefaultProps: PickDefaultProps<HeaderProps, 'isPanelOpen' | 'openedIcon' | 'closedIcon'> = {
    isPanelOpen: true,
    openedIcon: 'chevron-up',
    closedIcon: 'chevron-down'
};

interface HeaderTheme {
    readonly 'panel__headline': string;
    readonly 'panel__headline--noPadding': string;
    readonly 'panel__toggleBtn': string;
}

// tslint:disable-next-line:max-classes-per-file
export class Header extends PureComponent<HeaderProps> {
    public static defaultProps = headerDefaultProps;

    public static contextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    public render(): JSX.Element {
        const {
            children,
            isPanelOpen,
            openedIcon,
            closedIcon,
            theme,
            noPadding,
            toggleButtonId,
            ...rest
        } = this.props;
        // const {onPanelToggle} = this.context;

        const finalClassName = mergeClassNames([theme!.panel__headline], {
            [theme!['panel__headline--noPadding']]: noPadding
        });

        return (
            <div aria-expanded={isPanelOpen} {...rest}>
                <Headline
                    className={finalClassName}
                    type="h2"
                    >
                    {children}
                </Headline>

                <IconButton
                    className={theme!.panel__toggleBtn}
                    icon={isPanelOpen ? openedIcon : closedIcon}
                    // onClick={onPanelToggle}
                    id={toggleButtonId}
                />
            </div>
        );
    }
}

export interface ContentsProps {
    /**
     * An optional className to be rendered on the wrapping node.
     */
    className?: string;

    /**
     * Can be set to remove padding from the content area
     */
    noPadding?: boolean;

    /**
     * The rendered children which can be toggled.
     */
    children: ReactNode;

    /**
     * The propagated isOpen state from the toggle panel
     */
    isPanelOpen?: boolean;

    /**
     * An optional css theme to be injected.
     */
    theme?: ContentsTheme;
}

export const contentsDefaultProps: PickDefaultProps<ContentsProps, 'isPanelOpen'> = {
    isPanelOpen: true
}

interface ContentsTheme {
    'panel__contents': string;
    'panel__contents--noPadding': string;
}

// tslint:disable-next-line:max-classes-per-file
export class Contents extends PureComponent<ContentsProps> {
    public static defaultProps = contentsDefaultProps;

    public render(): JSX.Element {
        const {
            className,
            children,
            isPanelOpen,
            theme
        } = this.props;

        const finalClassName = mergeClassNames(theme!.panel__contents, {
            [theme!['panel__contents--noPadding']]: this.props.noPadding,
            className
        });

        return (
            <Collapse isOpened={isPanelOpen} springConfig={{stiffness: 300, damping: 30}}>
                <div className={finalClassName} aria-hidden={isPanelOpen ? 'false' : 'true'}>
                    {children}
                </div>
            </Collapse>
        );
    }
}
