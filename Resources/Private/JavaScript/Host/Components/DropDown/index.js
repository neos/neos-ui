import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import mergeClassNames from 'classnames';
import {executeCallback} from 'Shared/Utilities/';
import I18n from 'Host/Components/I18n/';
import Icon from 'Host/Components/Icon/';
import style from './style.css';

export default class DropDown extends Component {
    static propTypes = {
        // Style related propTypes.
        classNames: PropTypes.object.isRequired,

        // Either a label, icon or both need to be passed to have a clickable target which will toggle the DropDown.
        // ToDo: Add a check that one of both need to be passed to the Component.
        label: PropTypes.string,
        iconBefore: PropTypes.string,

        // Contents of the DropDown.
        children: PropTypes.node.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {isOpened: false};
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    render() {
        const {classNames, label} = this.props;
        const {isOpened} = this.state;
        const dropDownClassName = mergeClassNames({
            [classNames.wrapper]: classNames.wrapper && classNames.wrapper.length,
            [style.dropDown]: true,
            [style['dropDown--hasLabel']]: Boolean(label)
        });
        const buttonClassName = mergeClassNames({
            [classNames.btn]: classNames.btn && classNames.btn.length,
            [classNames['btn--active']]: isOpened,
            [style.dropDown__btn]: true
        });
        const contentsClassName = mergeClassNames({
            [classNames.contents]: classNames.contents && classNames.contents.length,
            [style.dropDown__contents]: true,
            [style['dropDown__contents--isOpen']]: isOpened
        });

        return (
            <div className={dropDownClassName} ref="dropDown">
                <button
                    className={buttonClassName}
                    onClick={e => executeCallback({e, cb: this.toggleDropDown.bind(this)})}
                    ref={btn => {
                        const method = isOpened ? 'focus' : 'blur';

                        // Initially focus the btn if the propType was set.
                        if (btn !== null) {
                            btn[method]();
                        }

                        this.toggler = btn;
                    }}
                    >
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

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(e) {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(e.target)) {
            this.closeDropDown();
        }
    }

    renderLabel() {
        const {label, classNames} = this.props;
        const className = mergeClassNames({
            [style.dropDown__btn__label]: true,
            [classNames.label]: classNames.label && classNames.label.length
        });

        return label ? <I18n fallback={label} id={label} className={className} /> : null;
    }

    renderBeforeIcon() {
        const {iconBefore, classNames} = this.props;
        const className = mergeClassNames({
            [style.dropDown__btn__beforeIcon]: true,
            [classNames.beforeIcon]: classNames.beforeIcon && classNames.beforeIcon.length
        });

        return iconBefore ? <Icon icon={iconBefore} className={className} /> : null;
    }

    renderChevronIcon() {
        const {isOpened} = this.state;
        const iconName = isOpened ? 'chevron-up' : 'chevron-down';

        return <Icon icon={iconName} className={style.dropDown__btn__afterIcon} />;
    }

    toggleDropDown() {
        this.setState({isOpened: !this.state.isOpened});
    }

    closeDropDown() {
        this.setState({isOpened: false});
    }
}
DropDown.defaultProps = {
    classNames: {}
};
