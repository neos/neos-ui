import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import {service} from '../../../Shared/';
import Icon from '../Icon/';
import Button from '../Button/';
import style from './style.css';

const {logger} = service;

export default class IconButtonDropDown extends Component {
    static propTypes = {
        className: PropTypes.string,
        isDisabled: PropTypes.bool,
        icon: PropTypes.string.isRequired,
        modeIcon: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        onItemSelect: PropTypes.func,
        children: PropTypes.node.isRequired
    }

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
        const children = this.props.children
            .map(child => typeof child === 'function' ? child() : child)
            .filter(child => child)
            .map((child, index) => (
                <a className={style.wrapper__dropDown__item} onClick={this.onItemSelect.bind(this, child.ref)} key={index}>
                    {child}
                </a>
            ));

        return (
            <div className={classNames} onMouseLeave={this.onMouseLeave.bind(this)}>
                <Button
                    isDisabled={isDisabled}
                    className={style.wrapper__btn}
                    onMouseDown={this.createHoldTimeout.bind(this)}
                    onClick={this.onClick.bind(this)}
                    >
                    <Icon icon={modeIcon} className={style.wrapper__btn__modeIcon} />
                    <Icon icon={icon} />
                </Button>
                <div className={dropDownClassNames}>
                    {children}
                </div>
            </div>
        );
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
            executeCallback(this.props.onClick);
        }
    }

    onMouseLeave() {
        this.cancelHoldTimeout();
        this.closeDropDown();
    }

    onItemSelect(ref) {
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
IconButtonDropDown.defaultProps = {
    modeIcon: 'long-arrow-right',
    isDisabled: false
};
