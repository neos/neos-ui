import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import ShallowDropDownHeader from './header.js';
import ShallowDropDownContents from './contents.js';

export class DropDownWrapper extends PureComponent {
    static propTypes = {
        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         * An optional style variant (default, darker)
         */
        style: PropTypes.string,

        /**
         * An optional padding around the contents
         */
        padded: PropTypes.bool,

        /**
         * This prop controls the initial visual opened state of the `DropDown`.
         */
        isOpen: PropTypes.bool.isRequired,

        /**
         * This callback gets called when the opened state toggles
         */
        onToggle: PropTypes.func,

        /**
         * The contents to be rendered, ideally `DropDown.Header` and `DropDown.Contents`.
         */
        children: PropTypes.any.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'dropDown': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    };

    static defaultProps = {
        isOpen: false,
        style: 'default'
    };

    static childContextTypes = {
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {isOpen: Boolean(props.isOpen)};
        this.handleToggle = event => {
            if (event) {
                event.stopPropagation();
            }

            this.toggle();
        };
        this.handleClose = event => {
            this.close();
            if (event) {
                event.stopPropagation();
            }
        };
        this.handleClickOutside = this.close.bind(this);
    }

    getChildContext() {
        return {
            toggleDropDown: this.handleToggle,
            closeDropDown: this.handleClose
        };
    }

    render() {
        const {children, className, theme, style, padded, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen', 'onToggle']);
        const styleClassName = style ? `dropDown--${style}` : false;
        const finalClassName = mergeClassNames({
            [theme[styleClassName]]: styleClassName,
            [theme['dropDown--padded']]: padded,
            [className]: className && className.length,
            [theme.dropDown]: true
        });

        return (
            <div {...rest} className={finalClassName}>
                {React.Children.map(
                    children,
                    child => <child.type {...child.props} isDropdownOpen={this.state.isOpen}/>
                )}
            </div>
        );
    }

    close() {
        this.setState({isOpen: false});
    }

    toggle() {
        if (this.props.onToggle) {
            this.props.onToggle(!this.state.isOpen);
        }

        this.setState({isOpen: !this.state.isOpen});
    }
}

export class ContextDropDownHeader extends PureComponent {
    static propTypes = {
        /**
         * The propagated isOpen state from the dropDown
         */
        isDropdownOpen: PropTypes.bool.isRequired
    };

    static contextTypes = {
        toggleDropDown: PropTypes.func.isRequired
    };

    render() {
        const {isDropdownOpen} = this.props;

        return <ShallowDropDownHeader isOpen={isDropdownOpen} {...this.props} {...this.context}/>;
    }
}
export class ContextDropDownContents extends PureComponent {
    static propTypes = {
        /**
         * The propagated isOpen state from the dropDown
         */
        isDropdownOpen: PropTypes.bool.isRequired
    };

    static contextTypes = {
        closeDropDown: PropTypes.func.isRequired
    };

    render() {
        const {isDropdownOpen} = this.props;

        return <ShallowDropDownContents isOpen={isDropdownOpen} {...this.props} {...this.context}/>;
    }
}

//
// Add the click-outside functionality to the DropDown component.
//
const EnhancedDropDown = enhanceWithClickOutside(DropDownWrapper);

export default EnhancedDropDown;
