import React, {Component, PropTypes} from 'react';
import Collapse from 'react-collapse';
import mergeClassNames from 'classnames';
import Headline from 'Components/Headline/index';
import IconButton from 'Components/IconButton/index';
import style from './style.css';

class ToggablePanel extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        className: PropTypes.string,
        children: PropTypes.node.isRequired
    };

    static defaultProps = {
        isOpen: false
    };

    static childContextTypes = {
        isOpen: PropTypes.bool.isRequired,
        togglePanel: PropTypes.func.isRequired,
        closePanel: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            isOpen: props.isOpen
        };
    }

    getChildContext() {
        return {
            isOpen: this.state.isOpen,
            togglePanel: () => this.toggle(),
            closePanel: () => this.close()
        };
    }

    componentWillReceiveProps(newProps) {
        const {isOpen} = newProps;

        if (isOpen !== this.state.isOpen) {
            this.setState({isOpen});
        }
    }

    render() {
        const {children, className} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.panel]: true,
            [style['panel--isOpen']]: this.state.isOpen
        });

        return (
            <section className={classNames}>
                {children}
            </section>
        );
    }

    close() {
        this.setState({isOpen: false});
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

class Header extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node.isRequired
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
            children,
            className
        } = this.props;
        const {isOpen, togglePanel} = this.context;
        const toggleIcon = isOpen ? 'chevron-up' : 'chevron-down';
        const classNames = mergeClassNames({
            [className]: className && className.length
        });

        return (
            <div className={classNames} aria-expanded={isOpen ? 'true' : 'false'}>
                <Headline
                    className={style.panel__headline}
                    type="h1"
                    style="h4"
                    >
                    {children}
                </Headline>
                <IconButton
                    className={style.panel__toggleBtn}
                    icon={toggleIcon}
                    onClick={() => togglePanel()}
                    />
            </div>
        );
    }
}

class Contents extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node.isRequired
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
            className
        } = this.props;
        const {isOpen} = this.context;
        const classNames = mergeClassNames({
            [style.panel__contents]: true,
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

//
// Assign the Child Component to the parent,
// to replicate the structure of a `DropDown` Component.
//
ToggablePanel.Header = Header;
ToggablePanel.Contents = Contents;

export default ToggablePanel;
