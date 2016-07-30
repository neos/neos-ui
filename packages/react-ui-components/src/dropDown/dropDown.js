import React, {Component, PropTypes} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import executeCallback from './../_lib/executeCallback.js';

export class DropDown extends Component {
    static propTypes = {
        className: PropTypes.string,
        isOpen: PropTypes.bool.isRequired,
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'dropDown': PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        isOpen: false
    };

    static childContextTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {isOpen: false};
    }

    getChildContext() {
        return {
            isOpen: this.state.isOpen,
            toggleDropDown: () => this.toggle(),
            closeDropDown: () => this.close()
        };
    }

    render() {
        const {children, className, theme, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen']);
        const dropDownClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.dropDown]: true
        });

        return (
            <div {...rest} className={dropDownClassName}>
                {children}
            </div>
        );
    }

    handleClickOutside() {
        this.close();
    }

    close() {
        this.setState({isOpen: false});
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export class Header extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'dropDown__btn': PropTypes.string,
            'dropDown__btnLabel': PropTypes.string,
            'dropDown__chevron': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    };

    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {className, children, theme, ...restProps} = this.props;
        const rest = omit(restProps, ['IconComponent']);
        const {isOpen, toggleDropDown} = this.context;
        const classNames = mergeClassNames({
            [theme.dropDown__btn]: true,
            [className]: className && className.length
        });
        const chevron = this.renderChevronIcon();

        return (
            <button
                {...rest}
                onClick={e => executeCallback({e, cb: () => toggleDropDown()})}
                ref={btn => {
                    const method = isOpen ? 'focus' : 'blur';

                    // Initially focus the btn if the propType was set.
                    if (btn !== null) {
                        btn[method]();
                    }
                }}
                className={classNames}
                aria-haspopup="true"
                >
                {children}
                {chevron}
            </button>
        );
    }

    renderChevronIcon() {
        const {IconComponent, theme} = this.props;
        const {isOpen} = this.context;
        const iconName = isOpen ? 'chevron-up' : 'chevron-down';

        return <IconComponent icon={iconName} className={theme.dropDown__chevron}/>;
    }
}

export class Contents extends Component {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'dropDown__contents': PropTypes.string,
            'dropDown__contents--isOpen': PropTypes.string
        }).isRequired
    };

    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {className, children, theme, ...rest} = this.props;
        const {isOpen, closeDropDown} = this.context;
        const contentsClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.dropDown__contents]: true,
            [theme['dropDown__contents--isOpen']]: isOpen
        });
        const ariaIsHiddenLabel = isOpen ? 'false' : 'true';

        return (
            <ul
                {...rest}
                className={contentsClassName}
                aria-hidden={ariaIsHiddenLabel}
                aria-label="dropdown"
                onClick={() => closeDropDown()}
                role="button"
                >
                {children}
            </ul>
        );
    }
}

//
// Add the click-outside functionality to the DropDown component.
//
const EnhancedDropDown = enhanceWithClickOutside(DropDown);

export default EnhancedDropDown;
