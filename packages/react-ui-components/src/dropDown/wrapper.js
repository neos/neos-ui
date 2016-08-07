import React, {Component, PropTypes} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
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
         * The contents to be rendered, ideally `DropDown.Header` and `DropDown.Contents`.
         */
        children: PropTypes.any.isRequired,

        /**
         * An optional css theme to be injected.
         */
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

        this.state = {isOpen: Boolean(props.isOpen)};
        this.handleToggle = this.toggle.bind(this);
        this.handleClose = this.close.bind(this);
        this.handleClickOutside = this.close.bind(this);
    }

    getChildContext() {
        return {
            isOpen: this.state.isOpen,
            toggleDropDown: this.handleToggle,
            closeDropDown: this.handleClose
        };
    }

    render() {
        const {children, className, theme, ...restProps} = this.props;
        const rest = omit(restProps, ['isOpen']);
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.dropDown]: true
        });

        return (
            <div {...rest} className={finalClassName}>
                {children}
            </div>
        );
    }

    close() {
        this.setState({isOpen: false});
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export class ContextDropDownHeader extends Component {
    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDropDown: PropTypes.func.isRequired
    };

    render() {
        return <ShallowDropDownHeader {...this.props} {...this.context}/>;
    }
}
export class ContextDropDownContents extends Component {
    static contextTypes = {
        isOpen: PropTypes.bool.isRequired,
        closeDropDown: PropTypes.func.isRequired
    };

    render() {
        return <ShallowDropDownContents {...this.props} {...this.context}/>;
    }
}

//
// Add the click-outside functionality to the DropDown component.
//
const EnhancedDropDown = enhanceWithClickOutside(DropDownWrapper);

export default EnhancedDropDown;
