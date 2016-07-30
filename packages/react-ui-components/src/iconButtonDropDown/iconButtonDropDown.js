import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Icon from './../icon/index';
import Button from './../button/index';

let logger;

try {
    logger = window.neos.logger;
} catch (e) {}

export default class IconButtonDropDown extends Component {
    static propTypes = {
        // The icon key which is always displayed.
        icon: PropTypes.string.isRequired,

        // You can pass an modeIcon which displays the current selected item in a leaner way.
        // Modify this prop via listening to the `onItemSelect` propType.
        modeIcon: PropTypes.string.isRequired,

        // Style related propTypes.
        className: PropTypes.string,
        isDisabled: PropTypes.bool,

        // Child items of the DropDown.
        children: PropTypes.node.isRequired,

        // Interaction related propTypes.
        onClick: PropTypes.func.isRequired,
        onItemSelect: PropTypes.func.isRequired,

        // Props which are propagated to the <Button> component.
        directButtonProps: PropTypes.object.isRequired,
        theme: PropTypes.shape({
            'wrapper': PropTypes.string,
            'wrapper__btn': PropTypes.string,
            'wrapper__btnModeIcon': PropTypes.string,
            'wrapper__dropDown': PropTypes.string,
            'wrapper__dropDown--isOpen': PropTypes.string,
            'wrapper__dropDownItem': PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        modeIcon: 'long-arrow-right',
        isDisabled: false,
        directButtonProps: {}
    };

    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.state = {isOpen: false};
    }

    render() {
        const {
            className,
            isDisabled,
            icon,
            modeIcon,
            theme
        } = this.props;
        const classNames = mergeClassNames({
            [theme.wrapper]: true,
            [className]: className && className.length
        });
        const dropDownClassNames = mergeClassNames({
            [theme.wrapper__dropDown]: true,
            [theme['wrapper__dropDown--isOpen']]: this.state.isOpen
        });
        const ariaIsHiddenLabel = this.state.isOpen ? 'false' : 'true';
        const directButtonProps = Object.assign({}, this.props.directButtonProps, {
            'aria-haspopup': 'true'
        });

        return (
            <div className={classNames} onMouseLeave={this.onMouseLeave.bind(this)}>
                <Button
                    {...directButtonProps}
                    isDisabled={isDisabled}
                    className={theme.wrapper__btn}
                    onMouseDown={this.createHoldTimeout.bind(this)}
                    onClick={this.onClick.bind(this)}
                    >
                    <Icon icon={modeIcon} className={theme.wrapper__btnModeIcon} />
                    <Icon icon={icon} />
                </Button>
                <div className={dropDownClassNames} aria-hidden={ariaIsHiddenLabel}>
                    {this.renderChildren()}
                </div>
            </div>
        );
    }

    renderChildren() {
        const {theme, children} = this.props;

        return children
            .map(child => typeof child === 'function' ? child() : child)
            .filter(child => child)
            .map((child, index) => (
                <a
                    role="button"
                    className={theme.wrapper__dropDownItem}
                    onClick={this.onItemSelected.bind(this, child.props.dropDownId)}
                    key={index}
                    >
                    {child}
                </a>
            ));
    }

    createHoldTimeout() {
        this.mouseHoldTimeout = setTimeout(() => {
            this.openDropDown();
        }, 200);
    }

    cancelHoldTimeout() {
        clearTimeout(this.mouseHoldTimeout);
    }

    onClick() {
        const {isOpen} = this.state;

        this.cancelHoldTimeout();

        if (!isOpen) {
            this.props.onClick();
        }
    }

    onMouseLeave() {
        this.cancelHoldTimeout();
        this.closeDropDown();
    }

    onItemSelected(ref) {
        const {onItemSelect} = this.props;

        if (!ref) {
            logger.error('Please specify a ref="" prop on your "IconButtonDropDown" children.');
        }

        if (onItemSelect) {
            onItemSelect(ref);
        }

        this.closeDropDown();
    }

    openDropDown() {
        this.setState({isOpen: true});
    }

    closeDropDown() {
        this.setState({isOpen: false});
    }
}
