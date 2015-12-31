import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class GridItem extends Component {
    static propTypes = {
        className: PropTypes.string,
        width: PropTypes.oneOf(['33%', '50%']).isRequired,
        children: PropTypes.node
    }

    render() {
        const {className, children, width} = this.props;
        const classNames = mergeClassNames({
            [style.grid__item]: true,
            [className]: className && className.length
        });
        const inlineStyle = {
            width
        };

        return (
            <div className={classNames} style={inlineStyle}>
                {children}
            </div>
        );
    }
}
