import React, {Component, PropTypes} from 'react';
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';

export default class ToggablePanel extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        children: PropTypes.any.isRequired,
        togglePanel: PropTypes.func
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

        if (isOpen !== this.state.isOpen && !newProps.togglePanel) {
            this.setState({isOpen});
        }
    }

    render() {
        //
        // If the `togglePanel` prop is provided, the component will not
        // be using internal state, instead it will be controlled by the props.
        //
        const isStateLess = Boolean(this.props.togglePanel);
        const togglePanel = isStateLess ? this.props.togglePanel : this.toggle;
        const isOpen = isStateLess ? this.props.isOpen : this.state.isOpen;

        return (
            <StatelessToggablePanel
                {...this.props}
                isOpen={isOpen}
                togglePanel={togglePanel}
                >
                {this.props.children}
            </StatelessToggablePanel>
        );
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export class StatelessToggablePanel extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        togglePanel: PropTypes.func.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'panel': PropTypes.string,
            'panel--isOpen': PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        isOpen: false
    };

    static childContextTypes = {
        isOpen: PropTypes.bool.isRequired,
        togglePanel: PropTypes.func.isRequired
    };

    getChildContext() {
        return {
            isOpen: this.props.isOpen,
            togglePanel: this.props.togglePanel
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
                {children}
            </section>
        );
    }
}

export class Header extends Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'panel__headline': PropTypes.string,
            'panel__toggleBtn': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        HeadlineComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired
    };

    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        togglePanel: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {
            HeadlineComponent,
            IconButtonComponent,
            children,
            theme,
            ...rest
        } = this.props;
        const {isOpen, togglePanel} = this.context;
        const toggleIcon = isOpen ? 'chevron-up' : 'chevron-down';

        return (
            <div aria-expanded={isOpen} {...rest}>
                <HeadlineComponent
                    className={theme.panel__headline}
                    type="h1"
                    style="h4"
                    >
                    {children}
                </HeadlineComponent>
                <IconButtonComponent
                    className={theme.panel__toggleBtn}
                    icon={toggleIcon}
                    onClick={togglePanel}
                    />
            </div>
        );
    }
}

export class Contents extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'panel__contents': PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        theme: {}
    };

    static contextTypes = {
        isOpen: PropTypes.bool.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {
            children,
            className,
            theme
        } = this.props;
        const {isOpen} = this.context;
        const finalClassName = mergeClassNames({
            [theme.panel__contents]: true,
            [className]: className && className.length
        });

        return (
            <Collapse isOpened={isOpen}>
                <div className={finalClassName} aria-hidden={isOpen ? 'false' : 'true'}>
                    {children}
                </div>
            </Collapse>
        );
    }
}
