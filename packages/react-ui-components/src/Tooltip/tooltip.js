import React, {PureComponent} from 'react';
import mergeClassNames from 'classnames';
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

        tooltipWrapperClassName: PropTypes.string,

        /**
         * The tooltip has to be aligned manually
         * in case that tooltip is at the left or right end of the browser
         */
        tooltipPosition: PropTypes.oneOf(['left', 'right']).isRequired,

        tooltipType: PropTypes.oneOf(['default', 'error']).isRequired,

        /**
         * The content shwon inside the tooltip wich appears on mouse over. Can
         * either be a simple string or other components
         */
        tooltipLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    };

    static defaultProps = {
        tooltipType: 'default',
        tooltipPosition: 'left'
    };

    state = {
        visible: false
    };

    componentDidMount() {
        if (this.props.tooltipType === 'error') {
            this.show();
        }
    }

    show = () => this.setVisibility(true);

    hide = () => this.setVisibility(false);

    setVisibility = visible => {
        this.setState({
            visible
        });
    }

    handleTouch = () => {
        this.show();
        this.assignOutsideTouchHandler();
    }

    assignOutsideTouchHandler = () => {
        const handler = e => {
            let currentNode = e.target;
            const componentNode = this.node.refs.instance();
            while (currentNode.parentNode) {
                if (currentNode === componentNode) {
                    return;
                }
                currentNode = currentNode.parentNode;
            }
            if (currentNode !== document) {
                return;
            }
            this.hide();
            document.removeEventListener('touchstart', handler);
        };
        document.addEventListener('touchstart', handler);
    }

    render() {
        const {show, hide, handleTouch, state} = this;
        const {theme, children, className, tooltipLabel, tooltipPosition, tooltipWrapperClassName, tooltipType, ...rest} = this.props;

        const wrapperClassNames = mergeClassNames({
            [tooltipWrapperClassName]: tooltipWrapperClassName && tooltipWrapperClassName.length,
            [theme.tooltip__wrapper]: true,
            [theme['tooltip__wrapper--error']]: tooltipType === 'error'
        });

        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.tooltip__body]: true,
            [theme['tooltip__body--offsetRight']]: tooltipPosition === 'right',
            [theme['tooltip__body--offsetLeft']]: tooltipPosition === 'left',
            [theme['tooltip__body--error']]: tooltipType === 'error'
        });

        return (
            <div
                {...rest}
                onMouseEnter={show}
                onMouseLeave={tooltipType === 'error' ? null : hide}
                onTouchStart={handleTouch}
                ref={`wrapper`}
                className={wrapperClassNames}
                >
                {children}
                {
                    state.visible &&
                    <div ref={`tooltip`} className={classNames}>
                        <div ref={`content`} className={theme.tooltip__content}>{tooltipLabel}</div>
                    </div>
                }
            </div>
        );
    }
}

export default Tooltip;
