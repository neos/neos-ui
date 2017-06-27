import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class AbstractButton extends PureComponent {
    static propTypes = {
        isEnabled: PropTypes.bool,
        isHighlighted: PropTypes.bool,
        className: PropTypes.string,
        label: PropTypes.string,
        children: PropTypes.node.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const {
            isEnabled,
            isHighlighted,
            className,
            ...directProps
        } = this.props;
        const btnClassName = mergeClassNames({
            [style.btn]: true,
            [style['btn--disabled']]: !isEnabled,
            [style['btn--notAllowed']]: !isEnabled,
            [style['btn--highlighted']]: isHighlighted,
            [className]: className && className.length
        });
        const attributes = {
            disabled: !isEnabled
        };

        return (
            <button className={btnClassName} {...attributes} {...directProps}>
                {this.props.children}
            </button>
        );
    }
}
