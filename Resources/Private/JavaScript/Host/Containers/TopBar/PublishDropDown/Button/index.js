import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Button extends Component {
    static propTypes = {
        isEnabled: PropTypes.bool,
        highlighted: PropTypes.bool,
        cavity: PropTypes.bool,
        label: PropTypes.string,
        indicator: PropTypes.number,
        children: PropTypes.node.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const {
            isEnabled,
            highlighted,
            cavity,
            indicator
        } = this.props;
        const btnClassName = mergeClassNames({
            [style.btn]: true,
            [style['btn--disabled']]: !isEnabled,
            [style['btn--notAllowed']]: !isEnabled,
            [style['btn--highlighted']]: highlighted,
            [style['btn--cavity']]: cavity
        });
        const attributes = {
            disabled: !isEnabled
        };

        return (
            <button className={btnClassName} onClick={() => this.onClick()} {...attributes}>
                {this.props.children} {indicator > 0 ? `(${indicator})` : ''}
            </button>
        );
    }

    onClick() {
        const {onClick} = this.props;

        onClick();
    }
}
