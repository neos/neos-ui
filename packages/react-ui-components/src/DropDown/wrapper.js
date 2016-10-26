import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import {Broadcast, Subscriber} from 'react-broadcast';
import ShallowDropDownHeader from './header.js';
import ShallowDropDownContents from './contents.js';

export class DropDownWrapper extends Component {
    static propTypes = {
        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

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
        isOpen: false
    };

    static childContextTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {isOpen: Boolean(props.isOpen)};
        this.handleToggle = event => {
            this.toggle();
            event.stopPropagation();
        };
        this.handleClose = event => {
            this.close();
            event.stopPropagation();
        };
        this.handleClickOutside = this.close.bind(this);
    }

    getChildContext() {
        return {
            toggleDropDown: this.handleToggle,
            closeDropDown: this.handleClose
        };
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {children, className, theme, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen', 'onToggle']);
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.dropDown]: true
        });

        return (
            <Broadcast channel="isDropdownOpen" value={this.state.isOpen}>
                <div {...rest} className={finalClassName}>
                    {children}
                </div>
            </Broadcast>
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

export class ContextDropDownHeader extends Component {
    static contextTypes = {
        toggleDropDown: PropTypes.func.isRequired
    };

    render() {
        return (<Subscriber channel="isDropdownOpen">{ isOpen =>
            <ShallowDropDownHeader isOpen={isOpen} {...this.props} {...this.context}/>
        }</Subscriber>);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }
}
export class ContextDropDownContents extends Component {
    static contextTypes = {
        closeDropDown: PropTypes.func.isRequired
    };

    render() {
        return (<Subscriber channel="isDropdownOpen">{ isOpen =>
            <ShallowDropDownContents isOpen={isOpen} {...this.props} {...this.context}/>
        }</Subscriber>);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }
}

//
// Add the click-outside functionality to the DropDown component.
//
const EnhancedDropDown = enhanceWithClickOutside(DropDownWrapper);

export default EnhancedDropDown;
