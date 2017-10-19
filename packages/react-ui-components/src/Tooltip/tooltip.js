import React, {PureComponent} from 'react';
import mergeClassNames from 'classnames';
import PropTypes from 'prop-types';

export class Tooltip extends PureComponent {

    static propTypes = {
        children: PropTypes.any.isRequired,

        theme: PropTypes.shape({
            'tooltip__wrapper': PropTypes.string,
            'tooltip__body': PropTypes.string,
            'tooltip__content': PropTypes.string,
            'tooltip__body--offsetLeft': PropTypes.string,
            'tooltip__body--offsetRight': PropTypes.string
        }).isRequired,

        position: PropTypes.oneOf(['left', 'right']).isRequired,

        tooltipLabel: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    show = () => this.setVisibility(true);

    hide = () => this.setVisibility(false);

    setVisibility = visible => {
        this.setState(Object.assign({}, this.state, {
            visible
        }));
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
        const {theme, tooltipLabel, children, position} = this.props;

        const classNames = mergeClassNames({
            [theme.tooltip__body]: true,
            [theme['tooltip__body--offsetLeft']]: position === 'left',
            [theme['tooltip__body--offsetRight']]: position === 'right'
        });

        return (
            <div
                onMouseEnter={show}
                onMouseLeave={hide}
                onTouchStart={handleTouch}
                ref={`wrapper`}
                className={theme.tooltip__wrapper}
                position={position}
                >
                {children}
                { state.visible &&
                <div ref={`tooltip`} className={classNames}>
                    <div ref={`content`} className={theme.tooltip__content}>{tooltipLabel}</div>
                </div>
                }
            </div>
        );
    }
}

export default Tooltip;
