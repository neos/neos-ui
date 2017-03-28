import React, {PureComponent, PropTypes} from 'react';
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';
import {Broadcast, Subscriber} from 'react-broadcast';

export default class ToggablePanel extends PureComponent {
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
        isOpen: false
    };

    constructor(props, context) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: props.isOpen
        };
    }

    componentWillReceiveProps(newProps) {
        const {isOpen} = newProps;
        const isStateLess = Boolean(newProps.onPanelToggle);

        if (isOpen !== this.state.isOpen && !isStateLess) {
            this.setState({isOpen});
        }
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

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export class StatelessToggablePanel extends PureComponent {
    static propTypes = {
        /**
         * This prop controls if the contents are visible or not.
         */
        isOpen: PropTypes.bool,

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
            'panel--isOpen': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
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
        const openedIcon = this.props.closesToBottom ? 'chevron-down' : 'chevron-up';
        const closedIcon = this.props.closesToBottom ? 'chevron-up' : 'chevron-down';

        const {children, className, theme} = this.props;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.panel]: true,
            [theme['panel--isOpen']]: this.props.isOpen
        });

        return (
            <Broadcast channel="isPanelOpen" value={{isOpen: this.props.isOpen, openedIcon, closedIcon}}>
                <section className={finalClassName}>
                    {children}
                </section>
            </Broadcast>
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
        IconButtonComponent: PropTypes.any.isRequired
    };

    static contextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    render() {
        const {
            HeadlineComponent,
            IconButtonComponent,
            children,
            theme,
            ...rest
        } = this.props;
        const {onPanelToggle} = this.context;

        const finalClassName = mergeClassNames([theme['panel__headline']],{
            [theme['panel__headline--noPadding']]: this.props.noPadding
        });

        return (
            <Subscriber channel="isPanelOpen">{ ({isOpen, openedIcon, closedIcon}) =>
                <div aria-expanded={isOpen} {...rest}>
                    <HeadlineComponent
                        className={finalClassName}
                        type="h1"
                        style="h4"
                        >
                        {children}
                    </HeadlineComponent>
                    <IconButtonComponent
                        className={theme.panel__toggleBtn}
                        icon={isOpen ? openedIcon : closedIcon}
                        onClick={onPanelToggle}
                        />
                </div>
            }</Subscriber>
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
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel__contents': PropTypes.string,
            'panel__contents--noPadding': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    };

    static defaultProps = {
        theme: {}
    };

    render() {
        const {
            children,
            className,
            theme
        } = this.props;

        const finalClassName = mergeClassNames(theme['panel__contents'],{
            [theme['panel__contents--noPadding']]: this.props.noPadding,
            [className]: className && className.length
        });

        return (
            <Subscriber channel="isPanelOpen">{ ({isOpen}) =>
                <Collapse isOpened={isOpen}>
                    <div className={finalClassName} aria-hidden={isOpen ? 'false' : 'true'}>
                        {children}
                    </div>
                </Collapse>
            }</Subscriber>
        );
    }
}
