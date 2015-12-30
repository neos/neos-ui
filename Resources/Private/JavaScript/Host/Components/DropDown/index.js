import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import I18n from '../I18n/';
import Icon from '../Icon/';
import style from './style.css';

export default class DropDown extends Component {
    static propTypes = {
        classNames: PropTypes.object.isRequired,
        label: PropTypes.string,
        iconBefore: PropTypes.string,
        children: PropTypes.node
    }

    constructor(props) {
        super(props);

        this.state = {isOpened: false};
    }

    render() {
        const {classNames, label} = this.props;
        const {isOpened} = this.state;
        const dropDownClassName = mergeClassNames({
            [classNames.wrapper]: true,
            [style.dropDown]: true,
            [style['dropDown--hasLabel']]: Boolean(label)
        });
        const buttonClassName = mergeClassNames({
            [classNames.btn]: true,
            [classNames['btn--active']]: isOpened,
            [style.dropDown__btn]: true
        });
        const contentsClassName = mergeClassNames({
            [classNames.contents]: true,
            [style.dropDown__contents]: true,
            [style['dropDown__contents--isOpen']]: isOpened
        });

        return (
            <div className={dropDownClassName} ref="dropDown" onBlur={this.onBlur.bind(this)}>
                <button className={buttonClassName} onClick={e => executeCallback(e, this.toggleDropDown.bind(this))}>
                    {this.renderBeforeIcon()}
                    {this.renderLabel()}
                    {this.renderChevronIcon()}
                </button>
                <ul className={contentsClassName}>
                    {this.props.children}
                </ul>
            </div>
        );
    }

    renderLabel() {
        const {label, classNames} = this.props;
        const className = mergeClassNames({
            [style.dropDown__btn__label]: true,
            [classNames.label]: true
        });

        return label ? <I18n target={label} className={className} /> : null;
    }

    renderBeforeIcon() {
        const {iconBefore, classNames} = this.props;
        const className = mergeClassNames({
            [style.dropDown__btn__beforeIcon]: true,
            [classNames.beforeIcon]: true
        });

        return iconBefore ? <Icon icon={iconBefore} className={className} /> : null;
    }

    renderChevronIcon() {
        const {isOpened} = this.state;
        const iconName = isOpened ? 'chevron-up' : 'chevron-down';

        return <Icon icon={iconName} className={style.dropDown__btn__afterIcon} />;
    }

    onBlur(e) {
        console.log('Fire event and close dropDown', e.relatedTarget);

        // ToDo: Automatically close the dropDown after the blur.
        // Temporarely disabled since the click events in this.props.children wont always trigger before this action is called.
        // setTimeout is not acceptable here.
        //
        // setTimeout(() => this.closeDropDown(), 500);
    }

    toggleDropDown() {
        this.setState({isOpened: !this.state.isOpened});
    }

    closeDropDown() {
        this.setState({isOpened: false});
    }
}
