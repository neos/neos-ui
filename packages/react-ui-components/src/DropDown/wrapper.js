import React, {PureComponent, PropTypes} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import {Broadcast, Subscriber} from 'react-broadcast';
import ShallowDropDownHeader from './header.js';
import ShallowDropDownContents from './contents.js';

const wrapperPropTypes = {
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
const defaultProps = {
    isOpen: false,
    style: 'default'
};

class StatelessDropDownWrapperWithoutClickOutsideBehavior extends PureComponent {
    static propTypes = {
        ...wrapperPropTypes,
        onToggle: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };
    static defaultProps = defaultProps;

    static childContextTypes = {
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.handleToggle = event => {
            if (event) {
                event.stopPropagation();
            }

            this.props.onToggle(event);
        };
        this.handleClose = event => {
            if (event) {
                event.stopPropagation();
            }
            this.props.onClose(event);
        };
    }

    getChildContext() {
        return {
            toggleDropDown: this.handleToggle,
            closeDropDown: this.handleClose
        };
    }

    handleClickOutside() {
        this.handleClose();
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
            <Broadcast channel="isDropdownOpen" value={this.props.isOpen}>
                <div {...rest} className={finalClassName}>
                    {children}
                </div>
            </Broadcast>
        );
    }
}

//
// Add the click-outside functionality to the StatelessDropDownWrapper component.
//
export const StatelessDropDownWrapper = enhanceWithClickOutside(StatelessDropDownWrapperWithoutClickOutsideBehavior);

export class DropDownWrapper extends PureComponent {
    static propTypes = wrapperPropTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.state = {isOpen: Boolean(props.isOpen)};
    }

    handleToggle = () => {
        if (this.props.onToggle) {
            this.props.onToggle();
        }

        this.setState({isOpen: !this.state.isOpen});
    }

    handleClose = () => {
        this.setState({isOpen: false});
    }

    render() {
        return <StatelessDropDownWrapper {...this.props} isOpen={this.state.isOpen} onToggle={this.handleToggle} onClose={this.handleClose}/>;
    }
}

export default DropDownWrapper;

export class ContextDropDownHeader extends PureComponent {
    static contextTypes = {
        toggleDropDown: PropTypes.func.isRequired
    };

    render() {
        return (<Subscriber channel="isDropdownOpen">{ isOpen =>
            <ShallowDropDownHeader isOpen={isOpen} {...this.props} toggleDropDown={this.context.toggleDropDown}/>
        }</Subscriber>);
    }
}
export class ContextDropDownContents extends PureComponent {
    static contextTypes = {
        closeDropDown: PropTypes.func.isRequired
    };

    render() {
        return (<Subscriber channel="isDropdownOpen">{ isOpen =>
            <ShallowDropDownContents isOpen={isOpen} {...this.props} {...this.context}/>
        }</Subscriber>);
    }
}
