import React, {Component, PropTypes} from 'react';
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';

class ToggablePanel extends Component {
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
        // If togglePanel function is provided the component will not be using internal state,
        // and would only depend on props.isOpen
        const togglePanel = this.props.togglePanel ? this.props.togglePanel : this.toggle.bind(this);
        const isOpen = this.props.togglePanel ? this.props.isOpen : this.state.isOpen;

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

class StatelessToggablePanel extends Component {
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
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.panel]: true,
            [theme['panel--isOpen']]: this.props.isOpen
        });

        return (
            <section className={classNames}>
                {children}
            </section>
        );
    }
}

export class Header extends Component {
    static propTypes = {
        className: PropTypes.string,
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
            className,
            theme
        } = this.props;
        const {isOpen, togglePanel} = this.context;
        const toggleIcon = isOpen ? 'chevron-up' : 'chevron-down';
        const classNames = mergeClassNames({
            [className]: className && className.length
        });

        return (
            <div className={classNames} aria-expanded={isOpen ? 'true' : 'false'}>
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
                    onClick={() => togglePanel()}
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
        const classNames = mergeClassNames({
            [theme.panel__contents]: true,
            [className]: className && className.length
        });

        return (
            <div>
                <Collapse isOpened={isOpen}>
                    <div className={classNames} key="panelContents" aria-hidden={isOpen ? 'false' : 'true'}>
                        {children}
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default ToggablePanel;
