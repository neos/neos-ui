import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import DropDownItem from './dropDownItem.js';

export default class IconButtonDropDown extends Component {
    static propTypes = {
        /**
         * The key of the Icon which is always displayed.
         */
        icon: PropTypes.string.isRequired,

        /**
         * Children to be rendered inside the DropDown.
         */
        children: PropTypes.any.isRequired,

        /**
         * You can pass an modeIcon which displays the current selected item in a leaner way.
         * Modify this prop via listening to the `onItemSelect` propType.
         */
        modeIcon: PropTypes.string.isRequired,

        /**
         * Will be called once the user clicks on the wrapper if
         * it is NOT opened right meow.
         */
        onClick: PropTypes.func.isRequired,

        /**
         * Will be called once the user selects an item.
         * You should specify an `dropDownId` prop on each child,
         * which will then be propagated to this handler as the first
         * and only argument.
         */
        onItemSelect: PropTypes.func.isRequired,

        /**
        * An optional css theme to be injected.
        */
        theme: PropTypes.shape({
            'wrapper': PropTypes.string,
            'wrapper__btn': PropTypes.string,
            'wrapper__btnModeIcon': PropTypes.string,
            'wrapper__dropDown': PropTypes.string,
            'wrapper__dropDown--isOpen': PropTypes.string,
            'wrapper__dropDownItem': PropTypes.string
        }).isRequired,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        IconComponent: PropTypes.any.isRequired,
        ButtonComponent: PropTypes.any.isRequired,

        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         * Controls the whole components disabled state.
         */
        isDisabled: PropTypes.bool,

        /**
         * Props which are propagated to the <Button> component.
         */
        directButtonProps: PropTypes.object
    };

    static defaultProps = {
        modeIcon: 'long-arrow-right',
        isDisabled: false,
        directButtonProps: {}
    };

    constructor(props) {
        super(props);

        this._mouseHoldTimeout = null;
        this._mouseHoverTimeout = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleHoldTimeout = this.createHoldTimeout.bind(this);
        this.handleHoverTimeout = this.createHoverTimeout.bind(this);
        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.state = {isOpen: false};
    }

    render() {
        const {
            IconComponent,
            ButtonComponent,
            className,
            isDisabled,
            icon,
            modeIcon,
            theme,
            directButtonProps,
            children
        } = this.props;
        const {isOpen} = this.state;
        const finalClassName = mergeClassNames({
            [theme.wrapper]: true,
            [className]: className && className.length
        });
        const dropDownClassNames = mergeClassNames({
            [theme.wrapper__dropDown]: true,
            [theme['wrapper__dropDown--isOpen']]: isOpen
        });

        return (
            <div className={finalClassName} onMouseLeave={this.handleMouseLeave}>
                <ButtonComponent
                    {...directButtonProps}
                    style="clean"
                    hoverStyle="clean"
                    aria-haspopup="true"
                    className={theme.wrapper__btn}
                    isDisabled={isDisabled}
                    onMouseDown={this.handleHoldTimeout}
                    onMouseEnter={this.handleHoverTimeout}
                    onFocus={this.handleHoverTimeout}
                    onClick={this.handleClick}
                    >
                    <IconComponent icon={modeIcon} className={theme.wrapper__btnModeIcon}/>
                    <IconComponent icon={icon} className={theme.wrapper__btnIcon}/>
                </ButtonComponent>
                <div className={dropDownClassNames} aria-hidden={isOpen ? 'false' : 'true'}>
                    {React.Children.map(children, (child, index) => (
                        <DropDownItem
                            key={index}
                            className={theme.wrapper__dropDownItem}
                            onClick={this.handleItemSelected}
                            id={child.props.dropDownId}
                            >
                            {child}
                        </DropDownItem>
                    ))}
                </div>
            </div>
        );
    }

    createHoldTimeout() {
        this._mouseHoldTimeout = setTimeout(() => this.openDropDown(), 200);
    }

    cancelHoldTimeout() {
        clearTimeout(this._mouseHoldTimeout);
    }

    createHoverTimeout() {
        this._mouseHoverTimeout = setTimeout(() => this.openDropDown(), 700);
    }

    cancelHoverTimeout() {
        clearTimeout(this._mouseHoverTimeout);
    }

    handleClick() {
        const {isOpen} = this.state;

        this.cancelHoldTimeout();
        this.cancelHoverTimeout();

        if (!isOpen) {
            this.props.onClick();
        }
    }

    handleMouseLeave() {
        this.cancelHoldTimeout();
        this.cancelHoverTimeout();
        this.closeDropDown();
    }

    handleItemSelected(ref) {
        this.props.onItemSelect(ref);
        this.closeDropDown();
    }

    openDropDown() {
        this.setState({isOpen: true});
    }

    closeDropDown() {
        this.setState({isOpen: false});
    }
}
