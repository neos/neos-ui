import React, {PureComponent} from 'react';
import mergeClassNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import PropTypes from 'prop-types';

export class Tooltip extends PureComponent {
    static propTypes = {
        children: PropTypes.any.isRequired,

        /* eslint-disable quote-props */
        theme: PropTypes.shape({
            'tooltip__wrapper': PropTypes.string,
            'tooltip__body': PropTypes.string,
            'tooltip__content': PropTypes.string
        }).isRequired,
        /* eslint-enable */

        className: PropTypes.string,

        wrapperClassName: PropTypes.string,

        /**
         * The tooltip has to be aligned manually
         * in case that tooltip is at the left or right end of the browser
         */
        position: PropTypes.oneOf(['left', 'right']).isRequired,

        type: PropTypes.oneOf(['default', 'error']).isRequired,

        /**
         * The content shwon inside the tooltip wich appears on mouse over. Can
         * either be a simple string or other components
         */
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    };

    static defaultProps = {
        type: 'default',
        position: 'left'
    };

    state = {
        isVisible: this.props.type === 'error'
    };

    show = () => this.setVisibility(true);

    hide = () => this.setVisibility(false);

    setVisibility = isVisible => {
        this.setState({
            isVisible
        });
    }

    handleTouch = () => {
        this.show();
    }

    handleClickOutside = () => {
        this.hide();
    }

    render() {
        const {show, hide, handleTouch} = this;
        const {isVisible} = this.state;
        const {theme, children, className, label, position, wrapperClassName, type, ...rest} = this.props;

        const wrapperClassNames = mergeClassNames({
            [wrapperClassName]: wrapperClassName && wrapperClassName.length,
            [theme.tooltip__wrapper]: true,
            [theme['tooltip__wrapper--error']]: type === 'error'
        });

        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.tooltip__body]: true,
            [theme['tooltip__body--offsetRight']]: position === 'right',
            [theme['tooltip__body--offsetLeft']]: position === 'left',
            [theme['tooltip__body--error']]: type === 'error'
        });

        return (
            <div
                {...rest}
                onMouseEnter={show}
                onMouseLeave={type === 'error' ? null : hide}
                onTouchStart={handleTouch}
                ref={`wrapper`}
                className={wrapperClassNames}
                >
                {children}
                {
                    isVisible &&
                    <div ref={`tooltip`} className={classNames}>
                        <div ref={`content`} className={theme.tooltip__content}>{label}</div>
                    </div>
                }
            </div>
        );
    }
}

export default enhanceWithClickOutside(Tooltip);
