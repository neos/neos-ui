import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';

const validStyleKeys = ['condensed'];

export default class ToggablePanel extends PureComponent {
    state = {
        isOpen: true
    };

    static propTypes = {
        /**
         * This prop controls if the contents are visible or not.
         */
        isOpen: PropTypes.bool,

        /**
         * Switches icon-open and icon-closed if set to true; can be used for
         * panels that close downwards such as the page structure tree.
         */
        closesToBottom: PropTypes.bool,

        /**
         * The children, ideally one Header and Contents component each.
         */
        children: PropTypes.any.isRequired,

        /**
         * The handler which will be called once the user toggles the contents.
         */
        onPanelToggle: PropTypes.func
    };

    static defaultProps = {
        isOpen: true
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        const {isOpen} = newProps;
        const isStateLess = Boolean(newProps.onPanelToggle);

        if (isOpen !== this.state.isOpen && !isStateLess) {
            this.setState({isOpen});
        }
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        //
        // If the `onPanelToggle` prop is provided, the component will not
        // be using internal state, instead it will be controlled by the props.
        //
        const isStateLess = Boolean(this.props.onPanelToggle);
        const onPanelToggle = isStateLess ? this.props.onPanelToggle : this.toggle;
        const isOpen = isStateLess ? this.props.isOpen : this.state.isOpen;

        return (
            <StatelessToggablePanel
                {...this.props}
                isOpen={isOpen}
                onPanelToggle={onPanelToggle}
                >
                {this.props.children}
            </StatelessToggablePanel>
        );
    }
}

export class StatelessToggablePanel extends PureComponent {
    static propTypes = {
        /**
         * This prop controls if the contents are visible or not.
         */
        isOpen: PropTypes.bool,

        /**
         * Switches icon-open and icon-closed if set to true; can be used for
         * panels that close downwards such as the page structure tree.
         */
        closesToBottom: PropTypes.bool,

        /**
         * An optional className to render on the wrapper.
         */
        className: PropTypes.string,

        /**
         * The children, ideally one Header and Contents component each.
         */
        children: PropTypes.any.isRequired,

        /**
         * The handler which will be called once the user toggles the contents.
         */
        onPanelToggle: PropTypes.func.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel': PropTypes.string,
            'panel--isOpen': PropTypes.string,
            'panel--condensed': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        /**
         * The `style` prop defines the regular visual style of the `Button`.
         */
        style: PropTypes.oneOf(validStyleKeys)
    };

    static defaultProps = {
        isOpen: false
    };

    static childContextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    getChildContext() {
        return {
            onPanelToggle: this.props.onPanelToggle
        };
    }

    render() {
        const {children, className, theme, style, isOpen} = this.props;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.panel]: true,
            [theme['panel--isOpen']]: isOpen,
            [theme[`panel--${style}`]]: validStyleKeys.includes(style)
        });

        return (
            <section className={finalClassName}>
                {React.Children.map(
                    children,
                    child => child.type ? <child.type {...child.props} isPanelOpen={isOpen}/> : child
                )}
            </section>
        );
    }
}

export class Header extends PureComponent {
    static propTypes = {
        /**
         * The children which will be rendered within the header.
         */
        children: PropTypes.any.isRequired,

        /**
         * The propagated isOpen state from the toggle panel
         */
        isPanelOpen: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel__headline': PropTypes.string,
            'panel__headline--noPadding': PropTypes.string,
            'panel__toggleBtn': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        /**
         * Can be set to remove padding from the content area
         */
        noPadding: PropTypes.bool,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        HeadlineComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired,

        /**
         * Optional icons as closing/opening indicator
         * If not provided defaults are chevron-up and chevron-down
         */
        openedIcon: PropTypes.string,
        closedIcon: PropTypes.string,
        toggleButtonId: PropTypes.string
    };

    static defaultProps = {
        isPanelOpen: true,
        openedIcon: 'chevron-circle-up',
        closedIcon: 'chevron-circle-down'
    }

    static contextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    render() {
        const {
            HeadlineComponent,
            IconButtonComponent,
            children,
            isPanelOpen,
            openedIcon,
            closedIcon,
            theme,
            noPadding,
            toggleButtonId,
            ...rest
        } = this.props;
        const {onPanelToggle} = this.context;

        const finalClassName = mergeClassNames([theme.panel__headline], {
            [theme['panel__headline--noPadding']]: noPadding
        });

        return (
            <div role="button" aria-expanded={isPanelOpen} onClick={onPanelToggle} {...rest}>
                <HeadlineComponent
                    className={finalClassName}
                    type="h2"
                    >
                    {children}
                </HeadlineComponent>
                <IconButtonComponent
                    className={theme.panel__toggleBtn}
                    hoverStyle="clean"
                    icon={isPanelOpen ? openedIcon : closedIcon}
                    id={toggleButtonId}
                    />
            </div>
        );
    }
}

export class Contents extends PureComponent {
    static propTypes = {
        /**
         * An optional className to be rendered on the wrapping node.
         */
        className: PropTypes.string,

        /**
         * Can be set to remove padding from the content area
         */
        noPadding: PropTypes.bool,

        /**
         * The rendered children which can be toggled.
         */
        children: PropTypes.any.isRequired,

        /**
         * The propagated isOpen state from the toggle panel
         */
        isPanelOpen: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel__contents': PropTypes.string,
            'panel__contents--noPadding': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    };

    static defaultProps = {
        theme: {},
        isPanelOpen: true
    };

    render() {
        const {
            className,
            children,
            isPanelOpen,
            theme
        } = this.props;

        const finalClassName = mergeClassNames(theme.panel__contents, {
            [theme['panel__contents--noPadding']]: this.props.noPadding,
            [className]: className && className.length
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
