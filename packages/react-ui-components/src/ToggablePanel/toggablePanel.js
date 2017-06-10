import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';

export default class ToggablePanel extends PureComponent {
    static propTypes = {
        /**
         * This prop controls if the contents are visible or not.
         */
        isOpen: PropTypes.bool,

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
        const {children, className, theme} = this.props;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.panel]: true,
            [theme['panel--isOpen']]: this.props.isOpen
        });

        return (
            <section className={finalClassName}>
                {React.Children.map(children, child => <child.type {...child.props} isPanelOpen={this.props.isOpen}/>)}
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
        isPanelOpen: PropTypes.bool.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel__headline': PropTypes.string,
            'panel__toggleBtn': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

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
            isPanelOpen,
            theme,
            ...rest
        } = this.props;
        const {onPanelToggle} = this.context;

        return (
            <div aria-expanded={isPanelOpen} {...rest}>
                <HeadlineComponent
                    className={theme.panel__headline}
                    type="h1"
                    style="h4"
                    >
                    {children}
                </HeadlineComponent>
                <IconButtonComponent
                    className={theme.panel__toggleBtn}
                    icon={isPanelOpen ? 'chevron-up' : 'chevron-down'}
                    onClick={onPanelToggle}
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
         * The rendered children which can be toggled.
         */
        children: PropTypes.any.isRequired,

        /**
         * The propagated isOpen state from the toggle panel
         */
        isPanelOpen: PropTypes.bool.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel__contents': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    };

    static defaultProps = {
        theme: {}
    };

    render() {
        const {
            className,
            children,
            isPanelOpen,
            theme
        } = this.props;
        const finalClassName = mergeClassNames({
            [theme.panel__contents]: true,
            [className]: className && className.length
        });

        return (
            <Collapse isOpened={isPanelOpen}>
                <div className={finalClassName} aria-hidden={isPanelOpen ? 'false' : 'true'}>
                    {children}
                </div>
            </Collapse>
        );
    }
}
