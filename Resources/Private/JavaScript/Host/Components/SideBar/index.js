import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class SideBar extends Component {
    static propTypes = {
        position: PropTypes.oneOf(['left', 'right']).isRequired,
        className: PropTypes.string,
        children: PropTypes.node.isRequired
    }

    render() {
        const {position, className} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.sideBar]: true,
            [style['sideBar--left']]: position === 'left',
            [style['sideBar--right']]: position === 'right'
        });

        return (
            <div className={classNames}>
              {this.props.children}
            </div>
        );
    }
}
