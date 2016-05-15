import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {service} from 'Shared/index';
import Icon from 'Components/Icon/index';
import Button from 'Components/Button/index';
import style from './style.css';

const {logger} = service;

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
        directButtonProps: PropTypes.object.isRequired
    };

    static defaultProps = {
        modeIcon: 'long-arrow-right',
        isDisabled: false,
        directButtonProps: {}
    };

    constructor(props) {
        super(props);

        this.mouseHoldTimeout = null;
        this.state = {isOpened: false};
    }

    render() {
        const {
            className,
            isDisabled,
            icon,
            modeIcon
        } = this.props;
        const classNames = mergeClassNames({
            [style.wrapper]: true,
            [className]: className && className.length
        });
        const dropDownClassNames = mergeClassNames({
            [style.wrapper__dropDown]: true,
            [style['wrapper__dropDown--isOpen']]: this.state.isOpened
        });
        const ariaIsHiddenLabel = this.state.isOpened ? 'false' : 'true';
        const directButtonProps = Object.assign({}, this.props.directButtonProps, {
            'aria-haspopup': 'true'
        });

        return (
            <div className={classNames} onMouseLeave={this.onMouseLeave.bind(this)}>
                <Button
                    isDisabled={isDisabled}
                    className={style.wrapper__btn}
                    onMouseDown={this.createHoldTimeout.bind(this)}
                    onClick={this.onClick.bind(this)}
                    {...directButtonProps}
                    >
                    <Icon icon={modeIcon} className={style.wrapper__btnModeIcon} />
                    <Icon icon={icon} />
                </Button>
                <div className={dropDownClassNames} aria-hidden={ariaIsHiddenLabel}>
                    {this.renderChildren()}
                </div>
            </div>
        );
    }

    renderChildren() {
        return this.props.children
            .map(child => typeof child === 'function' ? child() : child)
            .filter(child => child)
            .map((child, index) => (
                <a
                    role="button"
                    className={style.wrapper__dropDownItem}
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
        const {isOpened} = this.state;

        this.cancelHoldTimeout();

        if (!isOpened) {
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
        this.setState({isOpened: true});
    }

    closeDropDown() {
        this.setState({isOpened: false});
    }
}
