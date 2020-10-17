import React, {PureComponent, ReactNode} from 'react';
import ReactDOM from 'react-dom';
import mergeClassNames from 'classnames';

/**
 * Helper function to find the closest ancestor element that currently
 * has a scrollbar and could possibly cause the given element not to
 * be visible on screen.
 *
 * @param HTMLElement el
 * @return HTMLElement
 */
function getScrollContainer(el: HTMLElement): HTMLElement {
    if (el.scrollHeight > el.clientHeight) {
        const { overflowY } = getComputedStyle(el);

        if (overflowY === 'auto' || overflowY === 'scroll') {
            return el;
        }
    }

    if (el.parentElement) {
        return getScrollContainer(el.parentElement);
    } else {
        return document.body;
    }
}

/**
 * Helper function to determine whether the given element is visible
 * within its ancestor scroll context.
 *
 * @param HTMLElement el
 * @return boolean
 */
function isInScrollView(el: HTMLElement): boolean {
    const scrollContainer = getScrollContainer(el);
    const elementBoundingBox = el.getBoundingClientRect();
    const scrollContainerBoundingBox = scrollContainer.getBoundingClientRect();

    return (
        elementBoundingBox.top >= scrollContainerBoundingBox.top &&
        elementBoundingBox.bottom <= scrollContainerBoundingBox.bottom
    );
}

interface ShallowDropDownContentsTheme {
    readonly 'dropDown__contents': string;
    readonly 'dropDown__contents--isOpen': string;
    readonly 'dropDown__contents--scrollable': string;
}

export interface ShallowDropDownContentsProps {
    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * The contents to be rendered within the contents wrapper.
     */
    readonly children: ReactNode;

    /**
     * Limit height and add scrollbar.
     */
    readonly scrollable?: boolean;

    /**
     * These props control the visual state of the contents, and are passed
     * from the outside via the `ContextDropDownContents` component.
     */
    readonly isOpen: boolean;

    readonly closeDropDown: () => void;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: ShallowDropDownContentsTheme;

    /**
     * A React.RefObject pointing to the dropdown wrapper element
     */
    readonly wrapperRef: React.RefObject<HTMLElement>;

    /**
     * A custom function to calculate the minimum height, in case the
     * component is marked as scrollable.
     *
     * Defaults to: window => .25 * window.innerHeight
     */
    readonly getMinHeight: (window: Window, props: ShallowDropDownContentsProps) => number;

    /**
     * A custom function to calculate the maximum height, in case the
     * component is marked as scrollable.
     *
     * Defaults to: window => .8 * window.innerHeight
     */
    readonly getMaxHeight: (window: Window, props: ShallowDropDownContentsProps) => number;
}

export interface ShallowDropDownContentsState {
    /**
     * Calculated style properties
     */
    style: React.CSSProperties;
}

export default class ShallowDropDownContents extends PureComponent<ShallowDropDownContentsProps, ShallowDropDownContentsState> {
    public static defaultProps = {
        getMinHeight: (window: Window) => .25 * window.innerHeight, // 25vh
        getMaxHeight: (window: Window) => .8 * window.innerHeight, // 80vh
    };

    /**
     * Calculate position and dimensions of ShallowDropDownContents based on
     * its wrapper element.
     *
     * @param ShallowDropDownContentsProps props
     * @returns React.CSSProperties
     */
    public static getCalculatedStyleFromProps(props: ShallowDropDownContentsProps): React.CSSProperties {
        if (props.scrollable && props.wrapperRef.current) {
            // We're only going to make this calculation if the component is marked
            // as scrollable. Otherwise we expect the call-site to be aware of any
            // screen-related size-restrictions and reserve enough space below
            // wherever the dropdown is placed.

            if (isInScrollView(props.wrapperRef.current)) {
                const wrapperBoundingBox = props.wrapperRef.current?.getBoundingClientRect();

                if (wrapperBoundingBox) {
                    const minHeight = props.getMinHeight(window, props);
                    const maxHeight = props.getMaxHeight(window, props);

                    if (wrapperBoundingBox.y + wrapperBoundingBox.height + maxHeight <= window.innerHeight) {
                        // In this case, our dropdown contents component fits comfortably
                        // below the dropdown header
                        return {
                            top: wrapperBoundingBox.y + wrapperBoundingBox.height,
                            left: wrapperBoundingBox.x,
                            width: wrapperBoundingBox.width,
                            maxHeight
                        };
                    } else if (wrapperBoundingBox.y + wrapperBoundingBox.height + minHeight <= window.innerHeight) {
                        // Our dropdown contents component still fits below the
                        // dropdown header, but we need to shrink it a little
                        return {
                            top: wrapperBoundingBox.y + wrapperBoundingBox.height,
                            left: wrapperBoundingBox.x,
                            width: wrapperBoundingBox.width,
                            maxHeight: window.innerHeight - wrapperBoundingBox.height - wrapperBoundingBox.y
                        };
                    } else {
                        // Our dropdown contents component does not fit below the
                        // dropdown header, so we open it up above. We also keep the height
                        // at minimum, so that the upper left corner of our contents keeps
                        // its proximity to the dropdown header.
                        return {
                            bottom: window.innerHeight - wrapperBoundingBox.y,
                            left: wrapperBoundingBox.x,
                            width: wrapperBoundingBox.width,
                            maxHeight: minHeight
                        };
                    }
                }
            } else {
                // The dropdown wrapper is outside of the users view, so we hide our
                // dropdown contents component until it comes back.
                return {
                    display: 'none'
                };
            }
        }

        return {};
    }

    public static getDerivedStateFromProps(props: ShallowDropDownContentsProps): ShallowDropDownContentsState {
        return { style: ShallowDropDownContents.getCalculatedStyleFromProps(props) };
    }

    public readonly state = ShallowDropDownContents.getDerivedStateFromProps(this.props);

    public readonly recalculateStyle = () => requestAnimationFrame(() => {
        this.setState({ style: ShallowDropDownContents.getCalculatedStyleFromProps(this.props) });
    })

    public componentDidMount(): void {
        document.body.addEventListener('scroll', this.recalculateStyle, { capture: true });
        window.addEventListener('resize', this.recalculateStyle, { capture: true });
    }

    public componentWillUnmount(): void {
        document.body.removeEventListener('scroll', this.recalculateStyle, { capture: true });
        window.removeEventListener('resize', this.recalculateStyle, { capture: true });
    }

    public render(): JSX.Element | null {
        const {
            className,
            children,
            theme,
            isOpen,
            closeDropDown,
            scrollable,
        } = this.props;
        const finalClassName = mergeClassNames(
            theme!.dropDown__contents,
            className,
            {
                [theme!['dropDown__contents--scrollable']]: scrollable,
                [theme!['dropDown__contents--isOpen']]: isOpen
            }
        );

        if (isOpen) {
            const contents = (
                <ul
                    className={finalClassName}
                    aria-hidden={isOpen ? 'false' : 'true'}
                    aria-label="dropdown"
                    role="listbox"
                    onClick={closeDropDown}
                    style={this.state.style}
                    data-ignore_click_outside={true}
                >
                    {children}
                </ul>
            );

            return scrollable
                ? ReactDOM.createPortal(contents, document.body)
                : contents;
        } else {
            return null;
        }
    }
}
